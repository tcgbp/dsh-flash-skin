export interface AppearanceSnapshot {
  enabled: boolean;
  set: string;
}

export interface AppearanceSet {
  id: string;
  label: string;
}

export interface AppearanceScope {
  getSnapshot(): AppearanceSnapshot;
  subscribe(listener: () => void): () => void;
}

export interface AppearancePresenter {
  choose(setId: string): Promise<void>;
  disable(): Promise<void>;
}

const NATIVE_APPEARANCE_ROW = '[class*="_cubeRow"]';
const FLASH_APPEARANCE_SETS = "flash-appearance-sets";
const FLASH_APPEARANCE_BUTTON = "flash-appearance-choice";

function hasClassSuffix(node: Element, suffix: string) {
  return [...node.classList].some((name) => name.endsWith(suffix));
}

function findAppearanceRow() {
  for (const row of document.querySelectorAll<HTMLElement>(NATIVE_APPEARANCE_ROW)) {
    if (!hasClassSuffix(row, "_cubeRow")) continue;
    const nativeButtons = [...row.children].filter(
      (node): node is HTMLButtonElement => node instanceof HTMLButtonElement
        && hasClassSuffix(node, "_themeCube"),
    );
    if (nativeButtons.length < 3) continue;

    let group = row.parentElement;
    while (group !== null && !hasClassSuffix(group, "_group")) {
      group = group.parentElement;
    }
    group ??= row.parentElement;
    if (group !== null) return { row, group, nativeButtons };
  }
  return null;
}

interface MountedAppearance {
  row: HTMLElement;
  wrap: HTMLDivElement;
  restored: HTMLButtonElement[];
  buttons: Map<HTMLButtonElement, () => void>;
}

export function installFlashAppearanceSets(
  scope: AppearanceScope,
  presenter: AppearancePresenter,
  packageId: string,
  sets: readonly AppearanceSet[],
): () => void {
  let pending = false;
  let disposed = false;
  let mounted: MountedAppearance | null = null;

  const unmount = () => {
    if (mounted === null) return;
    for (const button of mounted.buttons.keys()) {
      button.remove();
    }
    for (const nativeButton of mounted.restored) {
      nativeButton.style.removeProperty("display");
      nativeButton.style.removeProperty("flex");
      nativeButton.setAttribute("aria-hidden", "false");
      nativeButton.removeAttribute("tabindex");
    }
    mounted.wrap.remove();
    mounted = null;
  };

  const choose = async (setId: string) => {
    if (disposed || pending) return;
    const snapshot = scope.getSnapshot();
    if (snapshot.enabled && snapshot.set === setId) return;
    pending = true;
    sync();
    try {
      if (setId === "") {
        await presenter.disable();
      } else {
        await presenter.choose(setId);
      }
    } catch {
      // The preference store remains the source of truth after a failed choice.
    } finally {
      pending = false;
      if (!disposed) sync();
    }
  };

  const createMount = (row: HTMLElement): MountedAppearance => {
    const wrap = document.createElement("div");
    wrap.className = FLASH_APPEARANCE_SETS;
    wrap.dataset.plugin = packageId;
    wrap.setAttribute("role", "radiogroup");
    wrap.setAttribute("aria-label", "Appearance");
    wrap.dataset.columns = String(sets.length);
    wrap.style.gridTemplateColumns = `repeat(${sets.length}, minmax(0, 1fr))`;

    const buttons = new Map<HTMLButtonElement, () => void>();
    for (const set of sets) {
      const button = document.createElement("button");
      button.className = FLASH_APPEARANCE_BUTTON;
      button.type = "button";
      button.dataset.plugin = packageId;
      button.dataset.set = set.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", set.label);

      const icon = document.createElement("span");
      icon.className = "flash-appearance-choice__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "◈";

      const label = document.createElement("span");
      label.className = "flash-appearance-choice__label";
      label.textContent = set.label;

      button.append(icon, label);
      const handleClick = () => { void choose(set.id); };
      button.addEventListener("click", handleClick);
      buttons.set(button, handleClick);
      wrap.append(button);
    }

    // Hide the native appearance buttons so the portrait sets take their place.
    const restored: HTMLButtonElement[] = [];
    for (const nativeButton of row.children) {
      if (!(nativeButton instanceof HTMLButtonElement)) continue;
      if (!hasClassSuffix(nativeButton, "_themeCube")) continue;
      nativeButton.style.setProperty("display", "none");
      nativeButton.setAttribute("aria-hidden", "true");
      nativeButton.setAttribute("tabindex", "-1");
      restored.push(nativeButton);
    }

    return { row, wrap, restored, buttons };
  };

  const sync = () => {
    if (disposed) return;
    const target = findAppearanceRow();
    if (target === null) {
      unmount();
      return;
    }
    if (mounted !== null && mounted.row !== target.row) unmount();
    mounted ??= createMount(target.row);
    const { wrap, buttons, restored } = mounted;
    if (wrap.parentElement !== target.group) {
      target.group.insertBefore(wrap, target.row);
    }

    const snapshot = scope.getSnapshot();
    for (const [button, set] of buttons) {
      const selected = snapshot.enabled && snapshot.set === set.id;
      button.disabled = pending;
      button.setAttribute("aria-checked", String(selected));
      button.classList.toggle("flash-appearance-choice--on", selected);
    }
    // Keep any reappearing native buttons hidden (row children rebuilt).
    const row = target.row;
    for (const child of row.children) {
      if (!(child instanceof HTMLButtonElement)) continue;
      if (!hasClassSuffix(child, "_themeCube")) continue;
      if (restored.includes(child)) continue;
      child.style.setProperty("display", "none");
      child.setAttribute("aria-hidden", "true");
      child.setAttribute("tabindex", "-1");
      restored.push(child);
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
  const unsubscribe = scope.subscribe(sync);
  sync();

  return () => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    unsubscribe();
    unmount();
  };
}
