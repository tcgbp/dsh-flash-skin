window.__ModuleLoader__.load({id:"dsh-flash-skin",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");

// src/client/skin.css
var skin_default = '.flash-skin-backdrop {\r\n  position: fixed;\r\n  z-index: -1;\r\n  inset: 0;\r\n  overflow: hidden;\r\n  pointer-events: none;\r\n  background: var(--flash-page, #f5f6f8);\r\n  opacity: 0;\r\n  transition: opacity 220ms ease;\r\n}\r\n\r\nbody[data-flash-skin="on"] .flash-skin-backdrop {\r\n  opacity: 1;\r\n}\r\n\r\n/* Portrait sequence layer: a person image that changes with the slider. */\r\n.flash-skin-backdrop .flash-skin-sequence-frame {\r\n  position: absolute;\r\n  top: 50%;\r\n  right: 0;\r\n  display: block;\r\n  width: min(42vw, 720px);\r\n  height: 100%;\r\n  object-fit: cover;\r\n  object-position: 50% 42%;\r\n  opacity: var(--flash-portrait-opacity, 0.45);\r\n  transform: translateY(-50%);\r\n  filter: none;\r\n  mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 10%, black 30%, black 100%);\r\n  transition: filter 180ms linear;\r\n}\r\n\r\n.flash-skin-backdrop img {\r\n  display: none;\r\n}\r\n\r\n.flash-skin-backdrop[data-media="sequence"] .flash-skin-sequence-frame {\r\n  display: block;\r\n  opacity: var(--flash-portrait-opacity, 0.6);\r\n}\r\n\r\n.flash-skin-backdrop[data-media="color"] img {\r\n  display: none;\r\n}\r\n\r\n/* \u4E3B\u9898\u8272/\u6309\u94AE/accent/\u8FB9\u6846/\u6587\u5B57/layer \u7B49 token \u67D3\u8272 \u2014\u2014 \u5DF2\u6309\u8981\u6C42\u79FB\u9664\uFF0C\r\n * \u9875\u9762\u6062\u590D App \u539F\u751F\u4E3B\u9898\u6837\u5F0F\u3002\u4EC5\u4FDD\u7559\u201C\u80CC\u666F\u900F\u51FA\u201D\u6700\u5C0F\u5FC5\u8981\u89C4\u5219\uFF1A\r\n * .flash-skin-backdrop \u4EBA\u7269\u7167\u5C42\u662F z-index:-1 \u7684\u5E95\u5C42\u56FA\u5B9A\u5C42\uFF0C\r\n * \u5FC5\u987B\u8BA9 App \u57FA\u7840\u80CC\u666F\u900F\u660E\u624D\u80FD\u900F\u51FA\u6765\uFF08\u5426\u5219\u88AB\u539F\u751F\u4E0D\u900F\u660E\u80CC\u666F\u76D6\u4F4F\uFF09\u3002\r\n * body \u5E95\u8272\u4ECD\u7531 backdrop \u5C42\u81EA\u8EAB\u7684 --flash-page \u63D0\u4F9B\u3002 */\r\nbody[data-flash-skin="on"] {\r\n  --dsw-alias-bg-base: transparent !important;\r\n  background: var(--flash-page) !important;\r\n}\r\n\r\nbody[data-flash-skin="on"] > #root {\r\n  background: transparent !important;\r\n}\r\n\r\nbody[data-flash-skin="on"] button,\r\nbody[data-flash-skin="on"] input,\r\nbody[data-flash-skin="on"] textarea {\r\n  transition: color 160ms linear, background-color 160ms linear, border-color 160ms linear;\r\n}\r\n\r\n.flash-level-control {\r\n  --flash-control-accent: var(--flash-accent, #4176e6);\r\n  --flash-control-rail: var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r\n  position: relative;\r\n  display: flex;\r\n  width: 124px;\r\n  height: 28px;\r\n  align-items: center;\r\n  margin: 0 3px;\r\n}\r\n\r\n.flash-level-control__range {\r\n  position: relative;\r\n  z-index: 1;\r\n  width: 100%;\r\n  height: 28px;\r\n  cursor: ew-resize;\r\n  appearance: none;\r\n  background: transparent;\r\n  touch-action: pan-y;\r\n}\r\n\r\n.flash-level-control__range::-webkit-slider-runnable-track {\r\n  height: 6px;\r\n  border-radius: 3px;\r\n  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\r\n}\r\n\r\n.flash-level-control__range::-webkit-slider-thumb {\r\n  width: 15px;\r\n  height: 15px;\r\n  margin-top: -4.5px;\r\n  border: 2px solid var(--flash-accent, #4176e6);\r\n  border-radius: 50%;\r\n  appearance: none;\r\n  background: #fff;\r\n  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);\r\n}\r\n\r\n.flash-level-control__range::-moz-range-track {\r\n  height: 6px;\r\n  border-radius: 3px;\r\n  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\r\n}\r\n\r\n.flash-level-control__range::-moz-range-thumb {\r\n  width: 11px;\r\n  height: 11px;\r\n  border: 2px solid var(--flash-accent, #4176e6);\r\n  border-radius: 50%;\r\n  background: #fff;\r\n}\r\n\r\n.flash-level-control__range:focus-visible {\r\n  outline: none;\r\n}\r\n\r\n.flash-level-control__ticks {\r\n  position: absolute;\r\n  inset: 0;\r\n  pointer-events: none;\r\n}\r\n\r\n.flash-level-control__tick {\r\n  position: absolute;\r\n  top: 11px;\r\n  width: 2px;\r\n  height: 6px;\r\n  border-radius: 1px;\r\n  background: var(--flash-control-rail, rgb(0 0 0 / 16%));\r\n}\r\n\r\n.flash-level-control__tooltip {\r\n  position: absolute;\r\n  bottom: 30px;\r\n  left: calc(var(--flash-slider-ratio, 0) * 100%);\r\n  transform: translateX(-50%);\r\n  padding: 3px 8px;\r\n  border-radius: 6px;\r\n  background: var(--flash-ink, #191b1e);\r\n  color: var(--flash-page, #f5f6f8);\r\n  font-size: 11px;\r\n  line-height: 1.4;\r\n  white-space: nowrap;\r\n  pointer-events: none;\r\n  z-index: 3;\r\n}\r\n\r\n.flash-appearance-binding {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 12px;\r\n  width: 100%;\r\n  margin: 2px 0;\r\n}\r\n\r\n.flash-appearance-binding[data-plugin] {\r\n  min-width: 260px;\r\n}\r\n\r\n.flash-portrait-set[data-plugin] {\r\n  box-sizing: border-box;\r\n  display: grid;\r\n  gap: 8px;\r\n  width: 100%;\r\n  margin: 2px 0;\r\n}\r\n\r\n.flash-portrait-set__label {\r\n  color: var(--dsw-alias-label-secondary);\r\n  font-size: 13px;\r\n  line-height: 18px;\r\n}\r\n\r\n.flash-appearance-sets {\r\n  box-sizing: border-box;\r\n  display: grid;\r\n  gap: 12px;\r\n  width: 100%;\r\n  margin: 2px 0;\r\n}\r\n\r\n.flash-appearance-sets[data-plugin] {\r\n  grid-template-columns: 1fr;\r\n}\r\n\r\n/* \u6BCF\u7EC4\u4EBA\u7269\u8096\u50CF\u5360\u4E00\u6574\u884C\uFF1A\u5DE6\u4FA7\u4E3A\u8EAB\u4EFD\uFF08\u25C8 + \u7EC4\u540D\uFF09\uFF0C\u53F3\u4FA7\u80F6\u7247\u6761\u94FA\u6EE1\u5269\u4F59\u5BBD\u5EA6\uFF0C\r\n * \u9010\u5E27\u5C55\u793A\u8BE5\u7EC4\u7684\u5168\u90E8\u7D20\u6750\uFF1B\u4E00\u884C\u653E\u4E0D\u4E0B\u65F6\u81EA\u52A8\u6362\u884C\uFF0C\u4E0D\u4EA7\u751F\u6A2A\u5411\u6EDA\u52A8\u6761\u3002 */\r\n.flash-appearance-choice {\r\n  box-sizing: border-box;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  flex-direction: row;\r\n  justify-content: flex-start;\r\n  align-items: center;\r\n  gap: 14px;\r\n  padding: 12px 14px;\r\n  border-radius: 14px;\r\n  font: inherit;\r\n  color: var(--dsw-alias-label-primary);\r\n  cursor: pointer;\r\n  background: transparent;\r\n  font-size: 14px;\r\n  line-height: 22px;\r\n  text-align: left;\r\n  display: flex;\r\n}\r\n\r\n.flash-appearance-choice:hover:not([aria-checked="true"]) {\r\n  background: var(--dsw-alias-interactive-bg-hover);\r\n}\r\n\r\n.flash-appearance-choice[aria-checked="true"],\r\n.flash-appearance-choice.flash-appearance-choice--on {\r\n  border-color: var(--dsw-static-neutral-bluish-400);\r\n  background: var(--dsw-alias-bg-module-platform);\r\n}\r\n\r\n.flash-appearance-choice__identity {\r\n  display: flex;\r\n  flex: 0 0 auto;\r\n  align-items: center;\r\n  gap: 8px;\r\n  min-width: 92px;\r\n  white-space: nowrap;\r\n}\r\n\r\n.flash-appearance-choice__filmstrip {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  flex: 1 1 auto;\r\n  min-width: 0;\r\n  align-items: center;\r\n  gap: 6px;\r\n  overflow: visible;\r\n  padding: 2px 2px 6px;\r\n}\r\n\r\n.flash-appearance-choice__frame {\r\n  display: block;\r\n  flex: 0 0 auto;\r\n  width: 52px;\r\n  height: 52px;\r\n  border-radius: 6px;\r\n  object-fit: cover;\r\n  object-position: 50% 30%;\r\n}\r\n\r\n.flash-appearance-choice__icon {\r\n  display: block;\r\n  flex: 0 0 16px;\r\n  width: 16px;\r\n  height: 16px;\r\n  color: currentColor;\r\n  font-size: 16px;\r\n  line-height: 16px;\r\n}\r\n\r\n.flash-appearance-choice__label {\r\n  display: block;\r\n}\r\n\r\n.flash-appearance-choice:disabled {\r\n  cursor: progress;\r\n  opacity: 0.7;\r\n}\r\n\r\n@media (max-width: 760px) {\r\n  .flash-level-control {\r\n    width: 92px;\r\n  }\r\n}\r\n\r\n@media (prefers-reduced-motion: reduce) {\r\n  .flash-skin-backdrop {\r\n    transition: none;\r\n  }\r\n}\r\n\r\n/* ---------------------------------------------------------------------------\r\n * \u81EA\u5B9A\u4E49\u914D\u7F6E\u9875\uFF1A\u8096\u50CF\u76AE\u80A4\u7EC4\u7BA1\u7406\u5668\uFF08plugins.bundle.config \u9875\u9762\u89C6\u56FE\uFF09\r\n * \u6CBF\u7528\u4E0A\u5C42 --dsw-* \u522B\u540D\u4E0E --flash-* \u53D8\u91CF\uFF0C\u9002\u914D\u660E\u6697\u4E24\u5957\u4E3B\u9898\u3002\r\n * ------------------------------------------------------------------------- */\r\n\r\n.flash-portrait-groups {\r\n  font-size: 14px;\r\n  line-height: 22px;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-portrait-groups__head {\r\n  display: flex;\r\n  align-items: baseline;\r\n  justify-content: space-between;\r\n  flex-wrap: wrap;\r\n  gap: 8px 12px;\r\n}\r\n\r\n.flash-portrait-groups__title {\r\n  margin: 0;\r\n  font-size: 16px;\r\n  font-weight: 600;\r\n  line-height: 24px;\r\n}\r\n\r\n.flash-portrait-groups__hint,\r\n.flash-portrait-groups__notice {\r\n  margin: 6px 0 14px;\r\n  color: var(--dsw-alias-label-tertiary);\r\n  font-size: 12px;\r\n  line-height: 18px;\r\n}\r\n\r\n.flash-portrait-groups__empty {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: flex-start;\r\n  gap: 10px;\r\n  padding: 16px;\r\n  border: 1px dashed var(--dsw-alias-border-l2);\r\n  border-radius: 12px;\r\n}\r\n\r\n.flash-portrait-group {\r\n  padding: 14px 0 16px;\r\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\r\n}\r\n\r\n.flash-portrait-group:last-child {\r\n  border-bottom: none;\r\n}\r\n\r\n.flash-portrait-group__head {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 12px;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n/* \u8EAB\u4EFD\u884C\uFF1Aset id + \u4E2D\u82F1\u6587\u540D\u79F0\u4E09\u4E2A\u5185\u8054\u8F93\u5165\u5361\uFF0Cid \u8F93\u5165\u7A84\u4E00\u4E9B\u4EE5\u793A\u5176\u4E3A\u6301\u4E45\u5316\u6807\u8BC6\u3002\r\n   \u6BCF\u5F20\u8F93\u5165\u5361\u81EA\u5E26\u4E00\u4E2A\u53EF\u89C1\u7684\u6587\u5B57\u6807\u7B7E\uFF08caption\uFF09\uFF0C\u8BF4\u660E\u8BE5\u5B57\u6BB5\u662F\u4EC0\u4E48\u3002 */\r\n.flash-portrait-group__identity {\r\n  display: flex;\r\n  align-items: flex-end;\r\n  gap: 10px;\r\n  flex: 1 1 auto;\r\n  min-width: 0;\r\n}\r\n\r\n.flash-portrait-group__field {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 2px;\r\n  flex: 1 1 0;\r\n  min-width: 0;\r\n}\r\n\r\n.flash-portrait-group__field-caption {\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  letter-spacing: 0.02em;\r\n  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));\r\n  text-transform: none;\r\n  user-select: none;\r\n}\r\n\r\n.flash-portrait-group__name--id {\r\n  font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;\r\n  font-size: 12px;\r\n}\r\n\r\n/* id \u5217\u7A0D\u7A84\uFF0C\u4FDD\u6301\u4E09\u4E2A\u8F93\u5165\u5361\u7684\u6A2A\u5411\u8FA8\u8BC6\u5EA6\uFF08\u6574\u5361\u5BBD\u5EA6\u7531 label \u63A7\u5236\uFF09\u3002 */\r\n.flash-portrait-group__field--id {\r\n  flex: 0 1 220px;\r\n}\r\n\r\n.flash-portrait-group__name--lang {\r\n  font-weight: 600;\r\n}\r\n\r\n.flash-portrait-group__name {\r\n  min-width: 0;\r\n  flex: 1 1 auto;\r\n  box-sizing: border-box;\r\n  padding: 4px 8px;\r\n  border: 1px solid transparent;\r\n  border-radius: 8px;\r\n  font: inherit;\r\n  font-weight: 600;\r\n  color: var(--dsw-alias-label-primary);\r\n  background: transparent;\r\n}\r\n\r\n.flash-portrait-group__name:hover {\r\n  border-color: var(--dsw-alias-border-l2);\r\n}\r\n\r\n.flash-portrait-group__name:focus {\r\n  border-color: var(--dsw-static-neutral-bluish-400);\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  outline: none;\r\n}\r\n\r\n.flash-portrait-group__divider-hint {\r\n  margin: 0 0 10px;\r\n}\r\n\r\n/* Light/dark divider that sits between the portrait thumbnails. The threshold\r\n   is moved step by step with the flanking arrow buttons, not by mouse drag. */\r\n.flash-portrait-group__divider {\r\n  position: relative;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  gap: 4px;\r\n  min-height: 128px;\r\n  user-select: none;\r\n  -webkit-user-select: none;\r\n}\r\n\r\n.flash-portrait-group__divider::before {\r\n  content: "";\r\n  position: absolute;\r\n  top: 4px;\r\n  bottom: 4px;\r\n  left: 50%;\r\n  width: 2px;\r\n  transform: translateX(-50%);\r\n  border-radius: 999px;\r\n  background: var(--dsw-alias-border-l2);\r\n}\r\n\r\n.flash-portrait-group__divider-arrow {\r\n  display: grid;\r\n  place-items: center;\r\n  width: 20px;\r\n  height: 20px;\r\n  padding: 0;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 999px;\r\n  font-size: 10px;\r\n  line-height: 1;\r\n  color: var(--dsw-alias-label-secondary);\r\n  background: var(--dsw-alias-bg-module-platform);\r\n}\r\n\r\n.flash-portrait-group__divider-arrow:hover:not(:disabled) {\r\n  border-color: var(--dsw-static-neutral-bluish-400);\r\n  color: var(--dsw-static-neutral-bluish-400);\r\n}\r\n\r\n.flash-portrait-group__divider-arrow:disabled {\r\n  opacity: 0.35;\r\n  cursor: not-allowed;\r\n}\r\n\r\n.flash-portrait-group__divider-handle {\r\n  position: relative;\r\n  width: 22px;\r\n  height: 22px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 999px;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n}\r\n\r\n.flash-portrait-group__divider-handle::after {\r\n  content: "";\r\n  position: absolute;\r\n  inset: 0;\r\n  margin: auto;\r\n  width: 10px;\r\n  height: 12px;\r\n  background: linear-gradient(\r\n    to right,\r\n    currentColor 0 1.5px,\r\n    transparent 1.5px 3px,\r\n    currentColor 3px 4.5px,\r\n    transparent 4.5px 6px,\r\n    currentColor 6px 7.5px\r\n  );\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n.flash-portrait-group__divider:hover::before {\r\n  background: var(--dsw-static-neutral-bluish-400);\r\n}\r\n\r\n.flash-portrait-group__actions {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 6px;\r\n}\r\n\r\n.flash-portrait-group__actions button,\r\n.flash-portrait-group__image-actions button,\r\n.flash-portrait-groups__empty button,\r\n.flash-portrait-group__add button,\r\n.flash-portrait-groups__foot button {\r\n  padding: 3px 10px;\r\n  border: 1px solid var(--dsw-alias-border-l2);\r\n  border-radius: 8px;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  line-height: 18px;\r\n  color: var(--dsw-alias-label-primary);\r\n  background: transparent;\r\n  cursor: pointer;\r\n}\r\n\r\n.flash-portrait-group__actions button:hover:not(:disabled),\r\n.flash-portrait-group__image-actions button:hover:not(:disabled),\r\n.flash-portrait-groups__empty button:hover:not(:disabled),\r\n.flash-portrait-group__add button:hover:not(:disabled),\r\n.flash-portrait-groups__foot button:hover:not(:disabled) {\r\n  background: var(--dsw-alias-interactive-bg-hover);\r\n}\r\n\r\n.flash-portrait-group__actions button:disabled,\r\n.flash-portrait-group__image-actions button:disabled,\r\n.flash-portrait-group__add button:disabled,\r\n.flash-portrait-groups__foot button:disabled {\r\n  cursor: not-allowed;\r\n  opacity: 0.45;\r\n}\r\n\r\n.flash-portrait-group__danger {\r\n  border-color: color-mix(in srgb, var(--dsw-static-severity-error-default, #d54343) 55%, transparent) !important;\r\n  color: var(--dsw-static-severity-error-default, #d54343) !important;\r\n}\r\n\r\n.flash-portrait-group__images {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));\r\n  gap: 10px;\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n\r\n.flash-portrait-group__image {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 6px;\r\n  min-height: 128px;\r\n}\r\n\r\n.flash-portrait-group__image img {\r\n  display: block;\r\n  width: 100%;\r\n  aspect-ratio: 1 / 1;\r\n  object-fit: cover;\r\n  border-radius: 10px;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  transition: opacity 160ms linear;\r\n}\r\n\r\n.flash-portrait-group__img {\r\n  cursor: zoom-in;\r\n}\r\n\r\n.flash-portrait-group__img:hover {\r\n  opacity: 0.9;\r\n}\r\n\r\n.flash-portrait-group__preview-hint {\r\n  position: absolute;\r\n  top: 6px;\r\n  right: 6px;\r\n  padding: 1px 6px;\r\n  border-radius: 999px;\r\n  font-size: 10px;\r\n  line-height: 16px;\r\n  color: #fff;\r\n  background: rgb(0 0 0 / 55%);\r\n  pointer-events: none;\r\n}\r\n\r\n/* Full-size "view original" lightbox shown while a portrait thumbnail is clicked. */\r\n.flash-lightbox {\r\n  position: fixed;\r\n  inset: 0;\r\n  z-index: 2147483000;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  padding: 32px;\r\n  background: rgb(0 0 0 / 72%);\r\n  cursor: zoom-out;\r\n}\r\n\r\n.flash-lightbox__img {\r\n  max-width: min(92vw, calc(100vh * 0.9));\r\n  max-height: 92vh;\r\n  object-fit: contain;\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n  box-shadow: 0 24px 80px rgb(0 0 0 / 55%);\r\n  cursor: default;\r\n}\r\n\r\n.flash-lightbox__close {\r\n  position: absolute;\r\n  top: 20px;\r\n  right: 20px;\r\n  width: 36px;\r\n  height: 36px;\r\n  display: grid;\r\n  place-items: center;\r\n  border-radius: 999px;\r\n  font-size: 16px;\r\n  line-height: 1;\r\n  color: #fff;\r\n  background: rgb(0 0 0 / 55%);\r\n  cursor: pointer;\r\n}\r\n\r\n.flash-lightbox__close:hover {\r\n  background: rgb(0 0 0 / 75%);\r\n}\r\n\r\n.flash-portrait-group__image-index {\r\n  position: absolute;\r\n  top: 6px;\r\n  left: 6px;\r\n  min-width: 18px;\r\n  padding: 0 5px;\r\n  border-radius: 999px;\r\n  font-size: 11px;\r\n  line-height: 18px;\r\n  text-align: center;\r\n  color: #fff;\r\n  background: rgb(0 0 0 / 55%);\r\n}\r\n\r\n.flash-portrait-group__image-actions {\r\n  position: absolute;\r\n  right: 6px;\r\n  bottom: 6px;\r\n  left: 6px;\r\n  display: none;\r\n  flex-wrap: wrap;\r\n  justify-content: center;\r\n  gap: 4px;\r\n}\r\n\r\n.flash-portrait-group__image:hover .flash-portrait-group__image-actions {\r\n  display: flex;\r\n}\r\n\r\n.flash-portrait-group__image-actions button {\r\n  padding: 2px 7px;\r\n  font-size: 11px;\r\n  background: var(--dsw-alias-bg-module-platform);\r\n}\r\n\r\n.flash-portrait-group__url {\r\n  box-sizing: border-box;\r\n  width: 100%;\r\n  padding: 5px 8px;\r\n  border: 1px solid var(--dsw-static-neutral-bluish-400);\r\n  border-radius: 8px;\r\n  font: inherit;\r\n  font-size: 12px;\r\n  line-height: 18px;\r\n  color: var(--dsw-alias-label-primary);\r\n  background: var(--dsw-alias-bg-module-platform);\r\n}\r\n\r\n.flash-portrait-group__url:focus {\r\n  outline: none;\r\n}\r\n\r\n.flash-portrait-group__add button {\r\n  align-self: stretch;\r\n  min-height: 128px;\r\n  border-style: dashed;\r\n  color: var(--dsw-alias-label-tertiary);\r\n}\r\n\r\n.flash-portrait-group__add button.flash-portrait-group__add-pick {\r\n  align-self: auto;\r\n  min-height: 0;\r\n  border-style: solid;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-portrait-group__add button:hover:not(:disabled) {\r\n  border-style: dashed;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-portrait-group__add button.flash-portrait-group__add-pick:hover:not(:disabled) {\r\n  border-style: solid;\r\n}\r\n\r\n.flash-portrait-groups__notice--error {\r\n  color: var(--dsw-static-severity-error-default, #d54343);\r\n}\r\n\r\n.flash-portrait-groups__conflict {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  margin-bottom: 12px;\r\n  padding: 10px 12px;\r\n  border: 1px solid var(--dsw-static-severity-error-default, #d54343);\r\n  border-radius: 8px;\r\n}\r\n\r\n.flash-portrait-groups__conflict-actions {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  align-items: flex-end;\r\n  gap: 10px;\r\n}\r\n\r\n.flash-portrait-groups__foot {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  margin-top: 14px;\r\n}\r\n\r\n.flash-portrait-groups__foot button {\r\n  padding: 5px 12px;\r\n}\r\n\r\n/* Network import: bundled example-archive quick picks (left) and a paste-any-URL\r\n * field (right). Both funnel into the same archive-import engine as the local\r\n * picker, so presentation stays light: flex rows + the shared input style. */\r\n.flash-import-net {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  align-items: center;\r\n  gap: 12px 16px;\r\n  margin-top: 12px;\r\n}\r\n\r\n.flash-import-net__label {\r\n  font-size: 12px;\r\n  color: var(--dsw-alias-label-secondary, #7a818b);\r\n  margin-right: 2px;\r\n}\r\n\r\n.flash-import-net__row {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  align-items: center;\r\n  gap: 6px;\r\n}\r\n\r\n.flash-import-net__example {\r\n  padding: 3px 10px;\r\n}\r\n\r\n.flash-import-net__example em {\r\n  font-style: normal;\r\n  opacity: 0.72;\r\n  margin-left: 2px;\r\n}\r\n\r\n.flash-import-net__url {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 8px;\r\n  flex: 1 1 320px;\r\n  min-width: 0;\r\n}\r\n\r\n.flash-import-net__url .flash-weights__input {\r\n  flex: 1 1 auto;\r\n  min-width: 0;\r\n}\r\n\r\n.flash-import-net__url button {\r\n  padding: 5px 12px;\r\n  flex: 0 0 auto;\r\n}\r\n\r\n/* =========================================================================\r\n * \u5C45\u5DE6\u5E03\u5C40\u8986\u76D6 \u2014\u2014 \u53EF\u8C03\u5BBD\u5EA6\u5BF9\u8BDD\u5185\u5BB9\u533A\uFF08\u76EE\u6807\u5BBF\u4E3B 0.2.1-rc.2\uFF09\r\n *\r\n * \u9700\u8986\u76D6\u7684\u539F\u751F\u89C4\u5219\uFF08dsh-client-ui-chat / -conversation \u7F16\u8BD1\u4EA7\u7269\uFF09\uFF1A\r\n *   .EvIC1a_column{max-width:var(--dsh-chat-content-width);width:100%;margin:0 auto}\r\n *   .wSkVaW_widthHandle{width:min(10px,calc((100% - var(--dsh-chat-content-width)) / 2 - 24px - 24px));...}\r\n *   .wSkVaW_widthHandle[data-side=left ]{right:calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\r\n *   .wSkVaW_widthHandle[data-side=right]{left :calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\r\n *\r\n * \u76EE\u6807\uFF1A\u5185\u5BB9\u5217\u7531\u201C\u4EE5\u89C6\u53E3\u4E2D\u70B9\u4E3A\u5BF9\u79F0\u8F74\u5C45\u4E2D\u201D\u6539\u4E3A\u201C\u9760\u5DE6\u5BF9\u9F50\u201D\uFF0C\u5E76\u5728\u5DE6\u4FA7\u9884\u7559\u4E00\u6BB5\r\n *       timeline \u69FD\u5BBD\uFF08\u9ED8\u8BA4 50px\uFF0C\u53EF\u8986\u76D6\u6539\uFF09\u3002\u53EA\u4FDD\u7559\u53F3\u4FA7\u62D6\u628A\uFF0C\u5E76\u628A\u53F3\u62D6\u628A\u91CD\u65B0\r\n *       \u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\u7EAF CSS\uFF0C\u53F3\u62D6\u628A\u6CBF\u7528\u539F\u751F \xD72 \u62D6\u62FD\u624B\u611F\u3002\r\n * ========================================================================= */\r\nbody[data-flash-skin="on"] {\r\n  /* \u5DE6\u4FA7\u4E3A timeline \u9884\u7559\u7684\u69FD\u5BBD\uFF08px\uFF09\u3002\u9700\u8981\u66F4\u5927/\u66F4\u5C0F\u65F6\u76F4\u63A5\u6539\u8FD9\u91CC\u3002 */\r\n  --dsh-flash-timeline-gutter: 40px;\r\n  /* \u53F3\u62D6\u628A\u4E0E\u5185\u5BB9\u5217\u53F3\u7F18\u7684\u95F4\u9699\uFF08\u7EE7\u627F\u539F\u751F 24px \u624B\u611F\uFF09\u3002 */\r\n  --dsh-flash-handle-gap: 24px;\r\n  /* \u5BF9\u9F50\u57FA\u51C6\u8F74 = \u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D\u3002\u69FD\u5BBD(50) + \u5185\u5BB9\u5217\u7236\u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u8FB9\u8DDD(\u4FA7\u4F59\u91CF16 + 16)\uFF0C\r\n   * \u4F7F\u5185\u5BB9\u5217\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u3002\u6B8B\u4F59\u7ED3\u6784\u5DEE\u7528 nudge \u5FAE\u8C03\uFF08\u9ED8\u8BA4 0\uFF0C\u6B63\u53F3\u79FB\uFF09\u3002 */\r\n  --dsh-flash-content-left: calc(\r\n    var(--dsh-flash-timeline-gutter, 50px)\r\n    + var(--dsh-composer-side-clearance, 16px) + 16px\r\n  );\r\n  --dsh-flash-align-nudge: 0px;\r\n}\r\n\r\n/* 0) \u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u201C\u5B8C\u5168\u4E00\u6837\u5BBD\u201D\u3002\r\n *    \u539F\u751F .wSkVaW_body \u628A --dsh-composer-card-max-width \u8BBE\u4E3A\r\n *    calc(var(--dsh-chat-content-width) + 32px)\uFF0C\u8F93\u5165\u5361\u6BD4\u5185\u5BB9\u5217\u5BBD 32px\u3002\r\n *    \u6B64\u5904\u76F4\u63A5\u5728 .wSkVaW_body \u7EA7\u8986\u5199\u4E3A = \u5185\u5BB9\u5217\u5BBD\uFF0C\u8BA9\u8F93\u5165\u5361(+todo+\u6392\u961F\u6761)\r\n *    \u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u3001\u540C\u5DE6\u7F18\uFF0C\u53F3\u7F18\u4E5F\u9010\u70B9\u5BF9\u9F50\u3002 */\r\nbody[data-flash-skin="on"] .wSkVaW_body {\r\n  --dsh-composer-card-max-width: var(--dsh-chat-content-width);\r\n}\r\n\r\n/* 1) \u5185\u5BB9\u5217\u6539\u4E3A\u8D34\u5DE6\uFF1A\u5DE6\u7F18\u5BF9\u9F50\u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D(= content-left\uFF0Cnudge \u53EF\u5FAE\u8C03)\uFF0C\r\n *    \u53F3\u8FB9\u8DDD auto\uFF08\u4E0D\u518D\u5BF9\u534A\u5C45\u4E2D\uFF09\u3002\r\n *    \u6CE8\uFF1A.EvIC1a_scroll \u81EA\u5E26 padding:16px calc(\u4FA7\u4F59\u91CF+16)\uFF0C\u6545\u8FD9\u91CC\u53BB\u6389\u7236 padding\uFF0C\r\n *    \u8BA9\u5185\u5BB9\u5217\u51C0\u5DE6\u7F18 = content-left\uFF0C\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u540C\u57FA\u51C6\u3002 */\r\nbody[data-flash-skin="on"] .EvIC1a_column {\r\n  margin-right: auto !important;\r\n  margin-left: calc(\r\n    var(--dsh-flash-timeline-gutter, 50px)\r\n    + var(--dsh-flash-align-nudge, 0px)\r\n  ) !important;\r\n}\r\n\r\n/* 2) \u9690\u85CF\u5DE6\u4FA7\u62D6\u628A\uFF0C\u53EA\u4FDD\u7559\u53F3\u4FA7\u3002 */\r\nbody[data-flash-skin="on"] .wSkVaW_widthHandle[data-side="left"] {\r\n  display: none !important;\r\n}\r\n\r\n/* 3) \u53F3\u4FA7\u62D6\u628A\u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\r\n *    \u5217\u53F3\u7F18\u76F8\u5BF9\uFF08\u5168\u5BBD\u7684\uFF09\u5B9A\u4F4D\u7956\u5148\u7684\u6C34\u5E73\u4F4D\u79FB =\r\n *       \u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u5BB9\u5185\u8FB9\u8DDD(var(--dsh-composer-side-clearance) + 16px)\r\n *     + timeline \u69FD 50px\r\n *     + \u5217\u5BBD var(--dsh-chat-content-width)\r\n *     + \u62D6\u628A\u95F4\u9699 24px\r\n *    \u62D6\u628A\u81EA\u8EAB\u5BBD\u5EA6\u56FA\u5B9A\u4E3A 10px\uFF08\u539F\u751F min(10px,\u2026) \u662F\u4E13\u4E3A\u5C45\u4E2D\u5E03\u5C40\u5199\u7684\uFF09\u3002\r\n */\r\nbody[data-flash-skin="on"] .wSkVaW_widthHandle[data-side="right"] {\r\n  left: calc(\r\n    var(--dsh-composer-side-clearance, 16px) + 16px\r\n    + var(--dsh-flash-timeline-gutter, 50px)\r\n    + var(--dsh-chat-content-width)\r\n    + var(--dsh-flash-handle-gap, 24px)\r\n  ) !important;\r\n  width: 10px !important;\r\n}\r\n\r\n/* 4) \u8F93\u5165\u5361\u7247\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\uFF08\u540C\u6837\u9884\u7559\u5DE6\u4FA7 timeline \u69FD\uFF09\u3002\r\n *    \u539F\u751F\u5C45\u4E2D\u6765\u81EA\u4E24\u5C42\uFF1A\r\n *       .uV2eYG_root{...;align-items:center}             -> \u8BA9 .uV2eYG_card \u6C34\u5E73\u5C45\u4E2D\r\n *       .wSkVaW_composerHero{...;align-self:center}     -> \u8BA9 hero \u8F93\u5165\u8868\u6574\u4F53\u5C45\u4E2D\r\n *    \u8F93\u5165\u5361\u5BBD\u5DF2\u7531\u7B2C 0 \u6BB5\u8986\u76D6\u4E3A\u201C\u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u201D(--dsh-composer-card-max-width\r\n *    = --dsh-chat-content-width)\uFF0C\u6545\u53EA\u9700\u5BF9\u9F50\u5DE6\u7F18\uFF1A\r\n *       \u5185\u5BB9\u5217\u5DE6\u7F18 = \u6EDA\u52A8\u533A\u5DE6 padding(= \u4FA7\u4F59\u91CF+16px) + \u69FD\u5BBD\r\n *       \u5361\u7247\u5DE6\u7F18   = \u8F93\u5165\u6839\u5DE6 padding(= \u4FA7\u4F59\u91CF) + \u5361\u7247 margin\r\n *       => margin = \uFF08\u4FA7\u4F59\u91CF+16px + \u69FD\u5BBD\uFF09- \u4FA7\u4F59\u91CF = 16px + \u69FD\u5BBD\r\n *    \u4E0E\u76AE\u80A4\u53D8\u91CF/\u4E3B\u9898\u8026\u5408\u4F4E\uFF0C\u6539\u69FD\u5BBD\u65F6\u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u540C\u6B65\u79FB\u52A8\u3002\u540C\u5BBD + \u540C\u5DE6\u7F18\r\n *    => \u8F93\u5165\u5361\u53F3\u7F18 = \u5185\u5BB9\u5217\u53F3\u7F18\uFF0C\u6EDA\u52A8\u5230\u6700\u4E0B\u6309\u94AE(\u7B2C 7 \u6BB5)\u5373\u9489\u5728\u5176\u4E0A\u65B9\u3002\r\n */\r\nbody[data-flash-skin="on"] .uV2eYG_root {\r\n  align-items: flex-start !important;\r\n}\r\nbody[data-flash-skin="on"] .uV2eYG_root > .uV2eYG_card {\r\n  margin-left: calc(16px + var(--dsh-flash-timeline-gutter, 50px)) !important;\r\n}\r\nbody[data-flash-skin="on"] .wSkVaW_composerHero {\r\n  align-self: flex-start !important;\r\n}\r\n\r\n/* 4a) \u8F93\u5165\u6846\u4E0B\u65B9\u7684\u4F1A\u8BDD\u7EDF\u8BA1\u884C\uFF08\u4F1A\u8BDD\u7EDF\u8BA1 Pill\uFF0Cconversation.composer.dock\r\n *     \u69FD\u4F4D\u7684 ActivityPill/UsagePill\uFF0C\u5BB9\u5668 .uV2eYG_dock[data-composer-dock]\uFF09\r\n *     \u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\u539F\u751F .uV2eYG_dock{justify-content:center} \u5C45\u4E2D\uFF0C\r\n *     \u4E14\u76AE\u80A4 .uV2eYG_root \u6539\u4E3A align-items:flex-start \u540E\u8BE5\u884C\u4F1A\u7F29\u5230\u5185\u5BB9\u5BBD\u3001\r\n *     \u8D34\u4F4F\u6839\u5DE6\u5185\u8FB9\u8DDD\uFF0C\u843D\u5728\u8F93\u5165\u5361\u5DE6\u4FA7\u3002\u8FD9\u91CC\u4EFF\u7167\u8F93\u5165\u5361(L808-810)\u7684\u57FA\u51C6\uFF0C\r\n *     \u628A\u8BE5\u884C\u6539\u4E3A\u5DE6\u5BF9\u9F50\u5E76\u65BD\u52A0\u540C\u6837\u7684 margin-left\uFF0C\u4F7F\u7EDF\u8BA1\u884C\u6700\u5DE6\u4FA7\u4E0E\u8F93\u5165\u5361\r\n *     \u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u4E0A\u3002\r\n */\r\nbody[data-flash-skin="on"] .uV2eYG_dock {\r\n  justify-content: flex-start !important;\r\n  margin-left: calc(16px + var(--dsh-flash-timeline-gutter, 50px)) !important;\r\n}\r\n\r\n/* 4b) \u65B0\u4F1A\u8BDD\u7A7A\u6001\u91CC\u7684\u201C\u9009\u62E9\u5DE5\u4F5C\u533A\u201D\u884C(.wSkVaW_heroWorkspaceRow)\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\r\n *     \u5B83\u662F .wSkVaW_composerStack \u7684\u76F4\u63A5\u5B50\u8282\u70B9\uFF08\u4E0E\u8F93\u5165\u5361\u3001todo\u3001\u6392\u961F\u6761\u540C\u539F\u70B9\uFF0C\r\n *     \u5E76\u4E0D\u5728 .pXSMma_* HeroShell \u5185\u90E8\uFF09\uFF0C\u539F\u751F\u9760\u5185\u8FB9\u8DDD padding-left:20px \u843D\u5728\u504F\u5DE6\r\n *     \u4F4D\u7F6E\uFF0C\u4E0E\u5DF2\u5DE6\u79FB\u7684\u8F93\u5165\u5361\u5DE6\u7F18\u9519\u4F4D\u3002\u6B64\u5904\u7528\u4E0E todo(.lXshSW_root)/\u6392\u961F\u6761\r\n *     (._7yHdaG_dock) \u5B8C\u5168\u76F8\u540C\u7684 margin-left \u57FA\u51C6\uFF0C\u5E76\u53BB\u6389\u90A3 20px \u539F\u751F\u5185\u8FB9\u8DDD\uFF0C\r\n *     \u8BA9\u82AF\u7247\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u3002\r\n */\r\nbody[data-flash-skin="on"] .wSkVaW_heroWorkspaceRow {\r\n  margin-left: calc(\r\n    var(--dsh-composer-side-clearance, 16px) + 16px\r\n    + var(--dsh-flash-timeline-gutter, 50px)\r\n  ) !important;\r\n  margin-right: auto !important;\r\n  padding-left: 0 !important;\r\n}\r\n\r\n/* 5) todo \u4EFB\u52A1\u680F\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\u3002\r\n *    TodoPanel \u6302\u8F7D\u5728 conversation.input.dock\uFF0C\u4E0E\u8F93\u5165\u5361\u540C\u5904\r\n *    .wSkVaW_composerStack\uFF1B\u539F\u751F .lXshSW_root{margin:0 auto} \u5C45\u4E2D\u3002\r\n *    \u8F93\u5165\u5361\u5DE6\u7F18\u76F8\u5BF9 stack \u539F\u70B9\u7684\u4F4D\u79FB = \u6839 padding \u5DE6(\u4FA7\u4F59\u91CF) + \u5361 margin(16+\u69FD)\r\n *      = \u4FA7\u4F59\u91CF + 16 + \u69FD\u3002\u8FD9\u91CC TodoPanel \u4E0E\u8F93\u5165\u5361\u540C\u539F\u70B9\uFF0C\r\n *    \u6545\u628A margin:0 auto \u6539\u4E3A margin-left = \u540C\u503C\u3001margin-right \u4FDD\u6301 auto\uFF0C\r\n *    \u8BA9 todo \u6761\u5E26\u7684\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\r\n */\r\nbody[data-flash-skin="on"] .lXshSW_root {\r\n  margin-left: calc(\r\n    var(--dsh-composer-side-clearance, 16px) + 16px\r\n    + var(--dsh-flash-timeline-gutter, 50px)\r\n  ) !important;\r\n  margin-right: auto !important;\r\n}\r\n\r\n/* 6) \u6392\u961F\u6D88\u606F\u6761\uFF08QueueDock\uFF0Cconversation.input.dock\uFF09\u4E0E\u8F93\u5165\u5361\u4E00\u8D77\u5C45\u5DE6\u3002\r\n *    QueueDock \u6302\u5728 conversation.input.dock\uFF0C\u4E0E TodoPanel(.lXshSW_root)\r\n *    \u540C\u5904 .wSkVaW_composerStack\uFF0C\u539F\u751F ._7yHdaG_dock{margin:0 auto} \u5C45\u4E2D\u3002\r\n *    \u4E0E todo \u7528\u540C\u4E00\u4E2A margin-left \u4F4D\u79FB\uFF0C\u8BA9\u6392\u961F\u6761\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361/\u5185\u5BB9\u5217\u5DE6\u7F18\u5BF9\u9F50\u3002\r\n */\r\nbody[data-flash-skin="on"] ._7yHdaG_dock {\r\n  margin-left: calc(\r\n    var(--dsh-composer-side-clearance, 16px) + 16px\r\n    + var(--dsh-flash-timeline-gutter, 50px)\r\n  ) !important;\r\n  margin-right: auto !important;\r\n}\r\n\r\n/* 7) \u201C\u6EDA\u52A8\u5230\u6700\u4E0B\u201D\u6309\u94AE\u4E0E\u5DE6\u79FB\u540E\u7684\u5185\u5BB9\u5217\u53F3\u7F18\u5BF9\u9F50\u3002\r\n *    \u539F\u751F .EvIC1a_toBottomSlot \u94FA\u6EE1\u6574\u5BBD(left:0 right:0)\uFF0C\u7528\r\n *    justify-content:flex-end + padding-right \u628A\u6309\u94AE\u9489\u5728\u201C\u5C45\u4E2D\u5BF9\u9F50\u65F6\u201D\r\n *    \u5185\u5BB9\u5217\u7684\u53F3\u7F18\u3002\u5185\u5BB9\u5217\u5DE6\u79FB\u69FD\u5BBD\u540E\uFF0C\u53F3\u7F18\u4E5F\u8DDF\u7740\u5DE6\u79FB\uFF0C\u6545\u628A padding-right\r\n *    \u6539\u4E3A\u201C\u53F3\u4FA7\u5B9E\u9645\u7A7A\u4F59\u201D= 100% \u2212 \u69FD\u5BBD \u2212 (\u4FA7\u4F59\u91CF+16) \u2212 \u5217\u5BBD\u3002\r\n */\r\nbody[data-flash-skin="on"] .EvIC1a_toBottomSlot {\r\n  padding-right: calc(\r\n    100% - var(--dsh-flash-timeline-gutter, 50px)\r\n    - var(--dsh-composer-side-clearance, 16px) - 16px\r\n    - var(--dsh-chat-content-width)\r\n  ) !important;\r\n}\r\n\r\n\r\n/* 8) \u4E09\u6BB5\u5F3A\u5EA6\u9A71\u52A8\u6A21\u5F0F\u9009\u62E9\u884C\uFF08DriverRow\uFF09\u3002\r\n *    \u624B\u52A8 / \u8DDF\u968F\u63A8\u7406 / \u7EFC\u5408\u52A0\u6743 \u7684 segmented \u5355\u9009\u7EC4\uFF0C\u7D27\u8DDF\u5728\u4EBA\u7269\u8096\u50CF\u7EC4\u884C\u4E0B\u65B9\u3002\r\n */\r\n.flash-appearance-binding--driver {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 12px;\r\n  width: 100%;\r\n  margin: 2px 0;\r\n}\r\n\r\n.flash-appearance-binding__label {\r\n  color: var(--dsw-alias-label-secondary);\r\n  font-size: 13px;\r\n  line-height: 18px;\r\n  white-space: nowrap;\r\n}\r\n\r\n.flash-segmented {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 2px;\r\n  padding: 2px;\r\n  border-radius: 8px;\r\n  background: var(--dsw-alias-surface-muted, rgb(0 0 0 / 6%));\r\n}\r\n\r\n.flash-segmented button {\r\n  padding: 3px 10px;\r\n  border: none;\r\n  border-radius: 6px;\r\n  background: transparent;\r\n  color: var(--dsw-alias-label-secondary);\r\n  font-size: 12px;\r\n  line-height: 16px;\r\n  cursor: pointer;\r\n}\r\n\r\n.flash-segmented button:hover:not(:disabled):not(.is-active) {\r\n  background: var(--dsw-alias-hover, rgb(0 0 0 / 4%));\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-segmented button.is-active {\r\n  /* ink/page \u540C tooltip \u7684\u914D\u5BF9,\u660E\u6697\u4E24\u5957\u4E3B\u9898\u90FD\u4FDD\u8BC1\u6587\u5B57\u53EF\u8BFB\u2014\u2014\r\n   * \u6DF1\u8272\u63A5\u6536\u8BE5\u522B\u540D\u5728\u6DF1\u8272 shell \u4E0B\u662F\u8FD1\u767D,\u914D\u767D\u5E95\u4F1A\u5B8C\u5168\u9690\u5F62\u3002 */\r\n  background: var(--flash-ink, #191b1e);\r\n  color: var(--flash-page, #f5f6f8);\r\n  box-shadow: 0 1px 3px rgb(0 0 0 / 18%);\r\n}\r\n\r\n.flash-segmented button:disabled {\r\n  opacity: 0.6;\r\n  cursor: default;\r\n}\r\n\r\n/* 9) \u7EFC\u5408\u52A0\u6743\u5B9E\u65F6\u4EEA\u8868\u3002\u52A0\u6743\u6A21\u5F0F\u4E0B\u4E0D\u663E\u793A\u6ED1\u6746\uFF0C\u4EC5\u4EE5 output \u9010\u8DEF\u663E\u793A\r\n *    \u52A0\u6743\u516C\u5F0F\uFF08\u5B9E\u65F6\u4EE3\u5165\u6743\u91CD\u4E0E\u5404\u4FE1\u53F7\u56E0\u5B50\uFF09\u4E0E\u5B9E\u65F6\u8BA1\u7B97\u51FA\u7684\u5F97\u5206\u3001\u5E27\u4F4D\u3002\r\n */\r\n.flash-level-control--composite {\r\n  width: auto;\r\n  height: auto;\r\n  flex-wrap: wrap;\r\n  align-items: flex-start;\r\n}\r\n\r\n.flash-level-control__gauge {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 2px 8px;\r\n  align-items: center;\r\n  margin-top: 2px;\r\n  padding-left: 2px;\r\n  color: var(--flash-secondary, #5b6470);\r\n  font-size: 10px;\r\n  line-height: 1.2;\r\n  font-variant-numeric: tabular-nums;\r\n}\r\n\r\n.flash-level-control__formula {\r\n  white-space: normal;\r\n  word-break: break-all;\r\n}\r\n\r\n.flash-level-control__term {\r\n  white-space: nowrap;\r\n}\r\n\r\n.flash-level-control__term b {\r\n  margin-right: 0;\r\n  /* ink \u4E3A\u81EA\u9002\u5E94\u6B63\u6587\u8272\uFF1A\u6D45\u8272\u4E0B\u8FD1\u9ED1\uFF0C\u6DF1\u8272\u4E0B\u8FD1\u767D\uFF0C\u516C\u5F0F\u624D\u80FD\u5728\u6DF1\u8272\u5E95\u4E0A\u53EF\u8BFB\u3002\r\n   * \u6B64\u524D\u8BEF\u7528\u672A\u5B9A\u4E49\u7684 --flash-primary\uFF0C\u6052\u56DE\u9000\u5230\u6DF1\u8272 #2b3440\uFF0C\u6DF1\u8272\u4E0B\u4E0E\u5E95\u649E\u8272\u3002 */\r\n  color: var(--flash-ink, #191b1e);\r\n  font-weight: 600;\r\n}\r\n\r\n.flash-level-control__mul {\r\n  color: var(--flash-accent, #4176e6);\r\n  font-weight: 800;\r\n  font-size: 12px;\r\n  padding: 0 1px;\r\n}\r\n\r\n.flash-level-control__plus {\r\n  display: inline-block;\r\n  margin: 0 2px;\r\n  /* \u540C .flash-level-control__term b\uFF0C\u7528\u81EA\u9002\u5E94 ink \u800C\u975E\u672A\u5B9A\u4E49\u7684 --flash-primary\u3002 */\r\n  color: var(--flash-ink, #191b1e);\r\n  font-style: normal;\r\n  font-weight: 700;\r\n  font-size: 11px;\r\n}\r\n\r\n.flash-level-control__score {\r\n  color: var(--flash-page, #f5f7fa);\r\n  background: var(--flash-ink, #171d26);\r\n  border-radius: 4px;\r\n  padding: 1px 5px;\r\n  font-weight: 600;\r\n}\r\n\r\n.flash-level-control__gauge .flash-level-control__frame {\r\n  color: var(--flash-accent, #4176e6);\r\n  font-weight: 600;\r\n}\r\n\r\n/* 10) \u7EFC\u5408\u52A0\u6743\u6743\u91CD\u8F93\u5165\uFF08\u63D2\u4EF6\u8BE6\u60C5\u914D\u7F6E\u5361\uFF09\u3002\r\n *     \u56DB\u4E2A step=0.05 \u7684\u6570\u5B57\u8F93\u5165 + \u6062\u590D\u9ED8\u8BA4\u6309\u94AE\uFF0C\u5199\u5165 localStorage \u7531\u8FD0\u884C\u65F6\u8BFB\u53D6\u3002\r\n */\r\n.flash-weights {\r\n  margin-top: 20px;\r\n  padding-top: 16px;\r\n  border-top: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 12%));\r\n}\r\n\r\n.flash-weights__head {\r\n  margin: 0 0 6px;\r\n}\r\n\r\n.flash-weights__title {\r\n  margin: 0;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  line-height: 20px;\r\n}\r\n\r\n.flash-weights__subtitle {\r\n  margin: 14px 0 0;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n  line-height: 16px;\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-weights__grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));\r\n  gap: 10px;\r\n  margin: 10px 0;\r\n}\r\n\r\n.flash-weights__field {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 4px;\r\n  min-width: 0;\r\n}\r\n\r\n.flash-weights__caption {\r\n  color: var(--dsw-alias-label-secondary);\r\n  font-size: 12px;\r\n  line-height: 16px;\r\n}\r\n\r\n.flash-weights__desc {\r\n  color: var(--dsw-alias-label-tertiary);\r\n  font-size: 11px;\r\n  line-height: 15px;\r\n  min-height: 30px;\r\n}\r\n\r\n.flash-weights__input {\r\n  width: 100%;\r\n  box-sizing: border-box;\r\n  padding: 4px 6px;\r\n  border: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r\n  border-radius: 6px;\r\n  background: var(--dsw-alias-bg-base, #fff);\r\n  color: var(--dsw-alias-label-primary);\r\n  font-size: 13px;\r\n}\r\n\r\n.flash-weights__input:focus {\r\n  outline: none;\r\n  border-color: var(--flash-accent, #4176e6);\r\n}\r\n\r\n.flash-weights__reset {\r\n  padding: 4px 12px;\r\n  border: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r\n  border-radius: 6px;\r\n  background: transparent;\r\n  color: var(--dsw-alias-label-secondary);\r\n  font-size: 12px;\r\n  line-height: 16px;\r\n  cursor: pointer;\r\n}\r\n\r\n.flash-weights__reset:hover:not(:disabled) {\r\n  background: var(--dsw-alias-hover, rgb(0 0 0 / 4%));\r\n  color: var(--dsw-alias-label-primary);\r\n}\r\n\r\n.flash-weights__reset:disabled {\r\n  opacity: 0.6;\r\n  cursor: default;\r\n}\r\n';

// src/client/portrait-loader.ts
var RETRY_DELAYS = [500, 1500, 3e3];
function retryUrl(source, retry) {
  if (retry === 0) return source;
  if (source.startsWith("data:")) return source;
  const hashIndex = source.indexOf("#");
  const hash = hashIndex < 0 ? "" : source.slice(hashIndex);
  const base = hashIndex < 0 ? source : source.slice(0, hashIndex);
  const queryIndex = base.indexOf("?");
  const path = queryIndex < 0 ? base : base.slice(0, queryIndex);
  const query = new URLSearchParams(queryIndex < 0 ? "" : base.slice(queryIndex + 1));
  query.set("retry", String(retry));
  return `${path}?${query}${hash}`;
}
function createPortraitLoader(options) {
  const sources = options.sources.map((source) => ({ ...source }));
  const assets = /* @__PURE__ */ new Map();
  for (const { url } of sources) {
    if (!assets.has(url)) {
      assets.set(url, {
        url,
        status: "idle",
        loadedUrl: null,
        retries: 0,
        image: null,
        timer: null,
        detach: null
      });
    }
  }
  const createImage = options.createImage ?? (() => new Image());
  let onChange = options.onChange;
  let active = false;
  let disposed = false;
  let generation = 0;
  let targetLevel = sources[0]?.level ?? 0;
  let displayedIndex = null;
  let lastState = null;
  const isCurrent = (run) => active && !disposed && generation === run;
  const nearestIndex = (available) => {
    let nearest = null;
    for (let index = 0; index < sources.length; index += 1) {
      if (!available(index)) continue;
      const distance = Math.abs(sources[index].level - targetLevel);
      const previous = nearest === null ? Infinity : Math.abs(sources[nearest].level - targetLevel);
      if (nearest === null || distance < previous || distance === previous && sources[index].level > sources[nearest].level) {
        nearest = index;
      }
    }
    return nearest;
  };
  const isReady = (index) => assets.get(sources[index].url)?.status === "ready";
  const emit = (state) => {
    if (lastState?.index === state.index && lastState.url === state.url && lastState.status === state.status) return;
    lastState = state;
    onChange?.(state);
  };
  const reconcile = () => {
    if (!active || disposed) return;
    const target = nearestIndex(() => true);
    if (target !== null && isReady(target)) displayedIndex = target;
    else if (displayedIndex === null) displayedIndex = nearestIndex(isReady);
    if (displayedIndex !== null) {
      const asset = assets.get(sources[displayedIndex].url);
      emit({ index: displayedIndex, url: asset.loadedUrl, image: asset.image, status: "ready" });
    } else {
      const exhausted = [...assets.values()].every((asset) => asset.status === "failed");
      emit({ index: null, url: null, image: null, status: exhausted ? "failed" : "loading" });
    }
  };
  const request = (asset, run) => {
    if (!isCurrent(run)) return;
    asset.status = "loading";
    const image = createImage();
    asset.image = image;
    image.loading = "eager";
    image.decoding = "async";
    const url = retryUrl(asset.url, asset.retries);
    let settled = false;
    let decoding = false;
    const current = () => !settled && isCurrent(run) && asset.image === image;
    const detach = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
      asset.detach = null;
    };
    const handleError = () => {
      if (!current()) return;
      settled = true;
      detach();
      image.removeAttribute("src");
      asset.image = null;
      if (asset.retries < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[asset.retries];
        asset.retries += 1;
        asset.timer = setTimeout(() => {
          if (!isCurrent(run)) return;
          asset.timer = null;
          request(asset, run);
        }, delay);
      } else {
        asset.status = "failed";
        reconcile();
      }
    };
    const handleLoad = () => {
      if (!current() || decoding) return;
      decoding = true;
      void image.decode().then(() => {
        if (!current()) return;
        settled = true;
        detach();
        asset.loadedUrl = url;
        asset.status = "ready";
        reconcile();
      }, handleError);
    };
    asset.detach = detach;
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
    image.src = url;
  };
  const stop = () => {
    active = false;
    generation += 1;
    for (const asset of assets.values()) {
      if (asset.timer !== null) clearTimeout(asset.timer);
      asset.timer = null;
      asset.detach?.();
      asset.image?.removeAttribute("src");
      asset.image = null;
      asset.status = "idle";
      asset.loadedUrl = null;
      asset.retries = 0;
    }
    displayedIndex = null;
    lastState = null;
  };
  return {
    start() {
      if (disposed || active) return;
      active = true;
      const run = ++generation;
      reconcile();
      for (const asset of assets.values()) request(asset, run);
    },
    select(level) {
      if (disposed || !Number.isFinite(level)) return;
      targetLevel = level;
      reconcile();
    },
    stop,
    dispose() {
      stop();
      disposed = true;
      onChange = null;
    }
  };
}

// src/client/logic.ts
var MAX_LEVEL = 6;
var PORTRAIT_IMPORT_MAX_IMAGES = 64;
function clampLevel(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
}
function clampLevelContinuous(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, value));
}
function dividerStepFor(count) {
  if (!Number.isFinite(count) || count <= 1) return 1;
  const total = Math.floor(count);
  return total - 1 > MAX_LEVEL ? MAX_LEVEL / total : 1;
}
function levelForEffort(index, count) {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round(safe / (count - 1) * MAX_LEVEL);
}
function selectedEffortIndex(efforts, selectedId, defaultId) {
  const id = selectedId ?? defaultId;
  return id === void 0 ? -1 : efforts.findIndex((effort) => effort.id === id);
}
function nearestEffortIndex(level, efforts) {
  if (efforts.length === 0) return -1;
  const safe = clampLevel(level);
  let best = 0;
  let distance = Math.abs(safe - levelForEffort(0, efforts.length));
  for (let index = 1; index < efforts.length; index += 1) {
    const next = Math.abs(safe - levelForEffort(index, efforts.length));
    if (next < distance) {
      best = index;
      distance = next;
    }
  }
  return best;
}
var LIGHT = {
  page: "#f5f6f8",
  surface: "#ffffff",
  ink: "#191b1e",
  secondary: "#5b6470",
  accent: "#4176e6"
};
var DARK = {
  page: "#101218",
  surface: "#1a1d24",
  ink: "#eef1f6",
  secondary: "#98a2b3",
  accent: "#c19a49"
};
var FROZEN_PALETTE = paletteForLevel(MAX_LEVEL);
function paletteForLevel(rawLevel, darkLevel) {
  const level = clampLevel(rawLevel);
  const darkAt = (() => {
    if (darkLevel === void 0) return MAX_LEVEL - 1;
    return Math.min(MAX_LEVEL, Math.max(0, Math.round(darkLevel)));
  })();
  const t = level / MAX_LEVEL;
  const mix = (from, to, amount) => {
    const pa = parseInt(from.slice(1), 16);
    const pb = parseInt(to.slice(1), 16);
    const ch = (shift) => {
      const ca = pa >> shift & 255;
      const cb = pb >> shift & 255;
      return Math.round(ca + (cb - ca) * amount);
    };
    const r = ch(16);
    const g = ch(8);
    const blue = ch(0);
    return `#${(1 << 24 | r << 16 | g << 8 | blue).toString(16).slice(1)}`;
  };
  const dark = level >= darkAt;
  const base = dark ? DARK : LIGHT;
  const portraitScale = level / MAX_LEVEL;
  return {
    level,
    stage: dark ? 1 : 0,
    strength: t,
    page: base.page,
    surface: base.surface,
    ink: base.ink,
    secondary: base.secondary,
    accent: base.accent,
    accentHover: mix(base.accent, base.ink, 0.13),
    portraitOpacity: String(0.4 + portraitScale * 0.42)
  };
}
function stagedFrames(count, maxLevel = MAX_LEVEL) {
  const safeMax = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  if (!Number.isFinite(count) || count <= 1) return [0];
  const total = Math.floor(count);
  if (total - 1 > safeMax) {
    return Array.from({ length: total }, (_, index) => index / (total - 1) * safeMax);
  }
  return Array.from(
    { length: total },
    (_, index) => Math.round(index / (total - 1) * safeMax)
  );
}
function frameIndexForContinuousLevel(level, count, maxLevel = MAX_LEVEL) {
  if (!Number.isFinite(level)) return 0;
  if (!Number.isFinite(count) || count <= 1) return 0;
  const frames = stagedFrames(count, maxLevel);
  const safeMax = Number.isFinite(maxLevel) ? Math.max(0, Math.round(maxLevel)) : MAX_LEVEL;
  const target = Math.min(safeMax, Math.max(0, level));
  let best = 0;
  let distance = Math.abs(target - frames[0]);
  for (let index = 1; index < frames.length; index += 1) {
    const next = Math.abs(target - frames[index]);
    if (next < distance || next === distance && frames[index] > frames[best]) {
      best = index;
      distance = next;
    }
  }
  return Math.max(0, Math.min(frames.length - 1, best));
}
function frameIndexForScore(score, count) {
  if (!Number.isFinite(score) || score <= 0) return 0;
  if (!Number.isFinite(count) || count <= 1) return 0;
  const total = Math.floor(count);
  const t = Math.min(1, Math.max(0, score));
  const position = t * (total - 1);
  const lo = Math.floor(position);
  const hi = Math.min(total - 1, Math.ceil(position));
  const dLo = position - lo;
  const dHi = hi - position;
  return dLo < dHi ? lo : hi;
}
var USAGE_FULL = 3e5;
var TURNS_FULL = 20;
var TPS_FULL = 80;
var DEFAULT_SPEED_TUNING = {
  graceMs: 600,
  fadeMs: 1500
};
var IDLE_GRACE_MS = DEFAULT_SPEED_TUNING.graceMs;
var IDLE_FADE_MS = DEFAULT_SPEED_TUNING.fadeMs;
var DEFAULT_COMPOSITE_WEIGHTS = {
  usage: 0.3,
  pressure: 0.3,
  effort: 0.2,
  speed: 0.2
};
function normalizeWeights(weights) {
  if (weights === null || typeof weights !== "object") return { ...DEFAULT_COMPOSITE_WEIGHTS };
  const fields = {
    usage: weights.usage,
    pressure: weights.pressure,
    effort: weights.effort,
    speed: weights.speed
  };
  let anyInvalid = false;
  for (const key of Object.keys(fields)) {
    const value = fields[key];
    if (value !== void 0 && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
      anyInvalid = true;
      break;
    }
  }
  const total = (fields.usage ?? 0) + (fields.pressure ?? 0) + (fields.effort ?? 0) + (fields.speed ?? 0);
  if (anyInvalid || total <= 0) return { ...DEFAULT_COMPOSITE_WEIGHTS };
  return {
    usage: (fields.usage ?? 0) / total,
    pressure: (fields.pressure ?? 0) / total,
    effort: (fields.effort ?? 0) / total,
    speed: (fields.speed ?? 0) / total
  };
}
function usageFactor(outputTokens) {
  const safe = Number.isFinite(outputTokens) && outputTokens > 0 ? outputTokens : 0;
  return Math.min(1, safe / USAGE_FULL);
}
function contextPressureFactor(pressureTokens, contextWindow, turns) {
  if (pressureTokens !== void 0 && Number.isFinite(pressureTokens) && pressureTokens >= 0 && contextWindow !== void 0 && Number.isFinite(contextWindow) && contextWindow > 0) {
    return Math.min(1, pressureTokens / contextWindow);
  }
  const safeTurns = typeof turns === "number" && Number.isFinite(turns) ? Math.max(0, turns) : 0;
  return Math.min(1, safeTurns / TURNS_FULL);
}
function reasoningEffortFactor(committedLevel) {
  const safe = Number.isFinite(committedLevel) ? committedLevel : 0;
  return Math.min(1, Math.max(0, safe / MAX_LEVEL));
}
function tokenSpeedFactor(decodeTokens, decodeMs) {
  if (!Number.isFinite(decodeTokens) || !Number.isFinite(decodeMs)) return 0;
  if (decodeTokens <= 0 || decodeMs <= 0) return 0;
  return Math.min(1, decodeTokens / (decodeMs / 1e3) / TPS_FULL);
}
function freshnessDecay(elapsedMs, graceMs = IDLE_GRACE_MS, fadeMs = IDLE_FADE_MS) {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return 1;
  if (elapsedMs <= graceMs) return 1;
  const over = elapsedMs - graceMs;
  if (over >= fadeMs) return 0;
  return 1 - over / fadeMs;
}
function clampFactor(factor) {
  return Math.min(1, Math.max(0, Number.isFinite(factor) ? factor : 0));
}
function weightedLevel(weights, factors = {}) {
  const w = normalizeWeights(weights);
  const sum = w.usage * clampFactor(factors.usage) + w.pressure * clampFactor(factors.pressure) + w.effort * clampFactor(factors.effort) + w.speed * clampFactor(factors.speed);
  return clampLevel(sum * MAX_LEVEL);
}
function normalizeImportMeta(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const src = raw;
  const meta = {};
  if (typeof src.id === "string") {
    const id = src.id.trim();
    if (id) meta.id = id;
  }
  const zh2 = typeof src.zh === "string" ? src.zh.trim() : "";
  const en = typeof src.en === "string" ? src.en.trim() : "";
  if (!zh2 || !en) return null;
  meta.zh = zh2;
  meta.en = en;
  const levelField = typeof src["dark-level"] === "number" ? src["dark-level"] : src.darkLevel;
  if (typeof levelField === "number" && Number.isFinite(levelField)) {
    meta.darkLevel = clampLevel(levelField);
  }
  if (Array.isArray(src.images)) {
    const urls = [];
    const seen = /* @__PURE__ */ new Set();
    for (const raw2 of src.images) {
      if (typeof raw2 !== "string") continue;
      const trimmed = raw2.trim();
      if (trimmed === "" || seen.has(trimmed)) continue;
      seen.add(trimmed);
      urls.push(trimmed);
      if (urls.length >= PORTRAIT_IMPORT_MAX_IMAGES) break;
    }
    if (urls.length > 0) meta.images = urls;
  }
  const usable = ["id", "zh", "en", "darkLevel", "images"].some((key) => meta[key] !== void 0);
  return usable ? meta : null;
}
function parsePortraitYaml(text) {
  const result = {};
  let blockKey = null;
  let found = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || /^(?:---|\.\.\.)\s*$/.test(line)) continue;
    if (/^\s/.test(rawLine)) {
      if (line.startsWith("#")) continue;
      if (blockKey !== null && line.startsWith("- ")) {
        const item = parseYamlScalar(stripYamlComment(line.slice(2)));
        if (item !== void 0) {
          appendBlockItem(result, blockKey, item);
          found = true;
          continue;
        }
      }
      blockKey = null;
      continue;
    }
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const key = line.slice(0, colon).trim();
    if (key === "" || key.includes(" ") || key.startsWith("{") || key.startsWith("[")) continue;
    const rest = stripYamlComment(line.slice(colon + 1));
    if (rest === "") {
      blockKey = key;
      continue;
    }
    blockKey = null;
    if (rest.startsWith("[") && rest.endsWith("]")) {
      const items = parseYamlFlowList(rest.slice(1, -1));
      if (items !== null) {
        result[key] = items;
        found = true;
        continue;
      }
    }
    const value = parseYamlScalar(rest);
    if (value === void 0) continue;
    result[key] = value;
    found = true;
  }
  return found ? result : null;
}
function appendBlockItem(result, key, item) {
  const current = result[key];
  if (Array.isArray(current)) {
    current.push(item);
  } else {
    result[key] = [item];
  }
}
function parseYamlFlowList(body) {
  const items = [];
  let current = "";
  let quote = null;
  for (let index = 0; index < body.length; index += 1) {
    const ch = body[index];
    if (quote !== null) {
      if (ch === "\\" && quote === '"') {
        current += ch + (body[index + 1] ?? "");
        index += 1;
        continue;
      }
      if (ch === "'" && quote === "'" && body[index + 1] === "'") {
        current += "''";
        index += 1;
        continue;
      }
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === ",") {
      items.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (quote !== null) return null;
  if (current.trim() !== "") items.push(current);
  const parsed = [];
  for (const raw of items) {
    const value = parseYamlScalar(stripYamlComment(raw));
    if (value === void 0) return null;
    parsed.push(value);
  }
  return parsed;
}
function stripYamlComment(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    const quote = trimmed[0];
    let index = 1;
    for (; index < trimmed.length; index += 1) {
      const ch = trimmed[index];
      if (ch === "\\" && quote === '"') {
        index += 1;
        continue;
      }
      if (ch !== quote) continue;
      if (quote === "'" && trimmed[index + 1] === "'") {
        index += 1;
        continue;
      }
      break;
    }
    return trimmed.slice(0, index + 1).trim();
  }
  return trimmed.replace(/\s+#.*/, "").trim();
}
function parseYamlScalar(raw) {
  const value = raw.trim();
  if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (value.length >= 2 && value[0] === "'" && value[value.length - 1] === "'") {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === "null" || value === "Null" || value === "NULL" || value === "~") return null;
  if (value === "true" || value === "True" || value === "TRUE") return true;
  if (value === "false" || value === "False" || value === "FALSE") return false;
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return value;
}
function parseImportMetaText(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    raw = parsePortraitYaml(text);
  }
  return normalizeImportMeta(raw);
}

// src/client/vendor/fflate.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
var gzs = function(d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, "invalid gzip data");
  var flg = d[3];
  var st = 10;
  if (flg & 4)
    st += (d[10] | d[11] << 8) + 2;
  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
    ;
  return st + (flg & 2);
};
var gzl = function(d) {
  var l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PACKAGE_ID = "dsh-flash-skin";
var LOCALE_NAMESPACE = "flash.skin";
var CONFIG_NAMESPACE = "flash-skin";
var LEVEL_KEY = "dsh-flash-skin.level";
var SET_KEY = "dsh-flash-skin.set";
var BIND_EFFORT_KEY = "dsh-flash-skin.bind-effort";
var DRIVER_KEY = "dsh-flash-skin.driver";
var WEIGHTS_KEY = "dsh-flash-skin.weights";
var ATTACHMENT_PATH = `/plugins/${PACKAGE_ID}/attachment`;
var EXAMPLES_PREFIX = `/plugins/${PACKAGE_ID}/examples/`;
var REMOTE_ARCHIVE_PATH = `/plugins/${PACKAGE_ID}/archive`;
var EXAMPLE_ARCHIVES = Object.freeze([
  { file: "liangsheng-demo.zip", zh: "\u6881\u5723", en: "Liang the Saint" },
  { file: "liangshen-demo.zip", zh: "\u6881\u795E", en: "Liang the God" },
  { file: "liangzu-demo.zip", zh: "\u6881\u7956", en: "Liang the Ancestor" },
  { file: "liangshen-url-demo.zip", zh: "\u6881\u795E\u5728\u7EBF\uFF08URL \u793A\u4F8B\uFF09", en: "Liang the God (URL-only)" },
  { file: "hanli-demo.zip", zh: "\u97E9\u7ACB", en: "Han Li" }
]);
var ARCHIVE_EXT_RE = /\.(zip|tar|tgz|gz|gzip)$/i;
var MAX_UPLOAD_IMAGES_PER_BATCH = 16;
var MEDIA_TYPE_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif"
};
var LEGACY_SET_IDS = {
  storm: "default",
  blaze: "default",
  frost: "default",
  liangsheng: "default",
  liangshen: "default",
  liangzu: "default"
};
function normalizeSetId(id) {
  if (!id) return void 0;
  const mapped = LEGACY_SET_IDS[id];
  return mapped !== void 0 ? mapped : id;
}
function defaultSetIdentity(id) {
  return id === DEFAULT_PORTRAIT_SET.id ? DEFAULT_PORTRAIT_SET : void 0;
}
function setDisplayName(set, active) {
  const def = defaultSetIdentity(set.id);
  const english = active.slice(0, 2).toLowerCase() === "en";
  const zh2 = (set.zh ?? def?.zh ?? "").trim();
  const en = (set.en ?? def?.en ?? "").trim();
  if (english) return en || zh2 || set.name || "";
  return zh2 || en || set.name || "";
}
function setFrames(set) {
  const configuredImages = set.images;
  return Array.isArray(configuredImages) ? configuredImages.slice() : [];
}
var DEFAULT_PORTRAIT_SET = {
  id: "default",
  zh: "\u9ED8\u8BA4",
  en: "Default"
};
function modelReasoning(state) {
  const current = state.current;
  if (current === null) return null;
  const group = state.groups.find((item) => item.id === current.provider);
  const model = group?.models.find((item) => item.id === current.model);
  if (model?.reasoning === void 0) return null;
  return {
    selection: current,
    efforts: model.reasoning.efforts,
    defaultEffort: model.reasoning.defaultEffort
  };
}
var cssVariables = [
  "--flash-page",
  "--flash-surface",
  "--flash-ink",
  "--flash-secondary",
  "--flash-accent",
  "--flash-accent-hover",
  "--flash-portrait-opacity"
];
var SkinPresenter = class {
  scope;
  theme;
  root;
  onChange;
  portraits;
  enabled = true;
  level = 0;
  set = DEFAULT_PORTRAIT_SET;
  // Per-group config mirrored from the persisted config card. images drive the
  // portrait sequence; darkLevel (absent → MAX_LEVEL - 1) drives the flip to
  // the dark shell.
  groupConfigs = {};
  portraitsSources = [];
  disposed = false;
  unsubscribe;
  darkLevelForCurrentSet() {
    const value = this.groupConfigs[this.set.id]?.darkLevel;
    if (value === void 0) return MAX_LEVEL - 1;
    return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
  }
  // Push an updated persisted config into the presenter: swap the current set's
  // portrait sources and re-derive its dark threshold. Image edits rebuild the
  // sequence loader; dark-level-only edits just re-apply the palette.
  setPortraitGroups(groups) {
    if (this.disposed) return;
    const configs = {};
    for (const group of groups) {
      configs[normalizeSetId(group.id)] = { images: group.images ?? [], darkLevel: group.darkLevel };
    }
    const nextSources = this.sourcesForSet(this.set, configs);
    const sourcesChanged = nextSources.length !== this.portraitsSources.length || nextSources.some((source, index) => source.url !== this.portraitsSources[index]?.url);
    this.groupConfigs = configs;
    this.portraitsSources = nextSources;
    if (this.enabled) {
      if (sourcesChanged) {
        this.portraits.dispose();
        this.portraits = createPortraitLoader({ sources: nextSources, onChange: this.onChange });
        this.portraits.start();
        this.updatePortrait();
      }
      this.applyPalette();
    }
  }
  sourcesForSet(set, configs = this.groupConfigs) {
    const group = configs[set.id];
    if (group && group.images.length > 0) {
      const frames = stagedFrames(group.images.length);
      return group.images.map((url, index) => ({
        level: frames[index] ?? 0,
        url
      }));
    }
    return [];
  }
  // Resolve a persisted/selected set id to a PortraitSet. Configured (custom)
  // ids must survive anyway: they carry their own configured group images, so
  // any unknown id resolves to `{ id }` and simply has nothing to show until a
  // group with that id exists. Only the default set is pre-registered.
  resolveSet(setId) {
    return { id: setId || DEFAULT_PORTRAIT_SET.id };
  }
  constructor(scope, theme) {
    this.scope = scope;
    this.theme = theme;
    const initialSetId = scope.getSnapshot().set;
    this.set = this.resolveSet(initialSetId);
    this.root = document.createElement("div");
    this.root.className = "flash-skin-backdrop";
    this.root.dataset.plugin = PACKAGE_ID;
    this.root.dataset.media = "color";
    this.root.setAttribute("aria-hidden", "true");
    this.onChange = ({ image }) => {
      if (this.disposed || !this.enabled) return;
      if (image === null) {
        this.root.dataset.media = "color";
        this.root.replaceChildren();
        return;
      }
      const portrait = image;
      portrait.className = "flash-skin-sequence-frame";
      portrait.alt = "";
      portrait.draggable = false;
      if (this.root.firstChild !== portrait) this.root.replaceChildren(portrait);
      this.root.dataset.media = "sequence";
    };
    this.portraits = this.buildPortraits(this.set);
    this.portraitsSources = this.sourcesForSet(this.set);
    this.unsubscribe = scope.subscribe(() => this.syncSettings());
    this.syncSettings();
  }
  buildPortraits(set) {
    return createPortraitLoader({
      sources: this.sourcesForSet(set),
      onChange: this.onChange
    });
  }
  syncSettings() {
    const snapshot = this.scope.getSnapshot();
    this.setEnabled(snapshot.enabled);
    this.setPortraitSet(this.resolveSet(snapshot.set));
  }
  isEnabled() {
    return this.enabled;
  }
  getLevel() {
    return this.level;
  }
  getSet() {
    return this.set;
  }
  setPortraitSet(set) {
    if (this.disposed || set.id === this.set.id) return;
    this.set = set;
    this.portraits.dispose();
    this.portraits = this.buildPortraits(set);
    this.portraitsSources = this.sourcesForSet(set);
    if (this.enabled) {
      this.portraits.start();
      this.updatePortrait();
      this.applyPalette();
    }
  }
  setEnabled(enabled) {
    if (this.disposed) return;
    this.enabled = enabled;
    if (enabled) {
      if (!this.root.isConnected) document.body.prepend(this.root);
      document.body.dataset.flashSkin = "on";
      this.applyPalette();
      this.portraits.start();
    } else {
      this.root.remove();
      this.portraits.stop();
      this.root.replaceChildren();
      this.root.dataset.media = "color";
      document.body.removeAttribute("data-flash-skin");
      for (const name of cssVariables) document.body.style.removeProperty(name);
    }
  }
  setLevel(level) {
    if (this.disposed) return;
    this.level = clampLevelContinuous(level);
    if (this.enabled) this.applyPalette();
  }
  // The colour scheme follows the reasoning level the way dsh-liang-skin does:
  // low levels keep the native light shell, and only the highest two stops
  // (level 5 and 6) switch to the dark shell.
  applyPalette() {
    if (this.disposed || !this.enabled) return;
    const palette = paletteForLevel(this.level, this.darkLevelForCurrentSet());
    const body = document.body;
    this.syncNativeTheme(palette.stage === 1 ? "dark" : "light");
    body.dataset.flashStage = String(palette.stage);
    body.style.setProperty("--flash-page", palette.page);
    body.style.setProperty("--flash-surface", palette.surface);
    body.style.setProperty("--flash-ink", palette.ink);
    body.style.setProperty("--flash-secondary", palette.secondary);
    body.style.setProperty("--flash-accent", palette.accent);
    body.style.setProperty("--flash-accent-hover", palette.accentHover);
    body.style.setProperty("--flash-portrait-opacity", palette.portraitOpacity);
    this.updatePortrait();
  }
  updatePortrait() {
    this.portraits.select(clampLevelContinuous(this.level));
  }
  /**
   * Composite mode: drive the portrait frame by a continuous normalized score
   * (0..1) mapped directly onto the group's N frames. The palette level stays
   * the integer 0..MAX_LEVEL grip; only the portrait advances freely so all N
   * frames are reachable, not just the seven integer stops.
   */
  setPortraitScore(score) {
    if (this.disposed) return;
    if (!Number.isFinite(score)) return;
    const t = Math.min(1, Math.max(0, score));
    this.portraits.select(t * MAX_LEVEL);
  }
  /** Number of portrait frames currently staged for the active set (0 when none). */
  getPortraitCount() {
    return this.portraitsSources.length;
  }
  syncNativeTheme(theme = paletteForLevel(this.level, this.darkLevelForCurrentSet()).stage === 1 ? "dark" : "light") {
    if (!this.enabled) return;
    const preference = this.theme.getTheme().preference;
    if (preference === theme) return;
    this.theme.setTheme(theme);
  }
  async choose(setId) {
    const set = this.resolveSet(setId);
    this.setEnabled(true);
    this.setPortraitSet(set);
    try {
      await this.scope.set(true);
      await this.scope.setSet(set.id);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }
  async disable() {
    this.setEnabled(false);
    try {
      await this.scope.set(false);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribe();
    this.portraits.dispose();
    this.root.remove();
    document.body.removeAttribute("data-flash-skin");
    delete document.body.dataset.flashStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
};
function FlashLevelControl({
  directory,
  load,
  select,
  presenter,
  scope,
  settings,
  weights,
  useProjection,
  locale,
  t
}) {
  const state = (0, import_react.useSyncExternalStore)(
    (listener) => directory.subscribe(listener),
    () => directory.getSnapshot()
  );
  const skin = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  const reasoning = (0, import_react.useMemo)(() => modelReasoning(state), [state]);
  const efforts = reasoning?.efforts ?? [];
  const committedIndex = selectedEffortIndex(
    efforts,
    reasoning?.selection.reasoningEffort,
    reasoning?.defaultEffort
  );
  const committedLevel = committedIndex < 0 ? MAX_LEVEL : levelForEffort(committedIndex, efforts.length);
  const driver = skin.driver;
  const [level, setLevel] = (0, import_react.useState)(() => {
    if (driver === "effort") return committedLevel;
    if (driver === "composite") return 0;
    return clampLevel(settings.level);
  });
  const [pending, setPending] = (0, import_react.useState)(false);
  const [failed, setFailed] = (0, import_react.useState)(false);
  const [interacting, setInteracting] = (0, import_react.useState)(false);
  const dragging = (0, import_react.useRef)(false);
  const dragStartLevel = (0, import_react.useRef)(level);
  const enabled = skin.enabled;
  (0, import_react.useEffect)(() => {
    if (enabled) load();
  }, [enabled, load]);
  (0, import_react.useEffect)(() => {
    if (driver !== "effort" || dragging.current || pending) return;
    setLevel(committedLevel);
    presenter.setLevel(committedLevel);
  }, [driver, committedLevel, pending, presenter]);
  (0, import_react.useEffect)(() => {
    if (enabled) presenter.setLevel(level);
    if (driver === "composite") return;
    try {
      localStorage.setItem(LEVEL_KEY, String(level));
    } catch {
    }
  }, [level, enabled, presenter, driver]);
  if (!enabled) return null;
  if (driver === "effort" && (reasoning === null || efforts.length < 2)) return null;
  const previewIndex = driver === "effort" ? nearestEffortIndex(level, efforts) : -1;
  const previewEffort = efforts[previewIndex];
  const progressRatio = level / MAX_LEVEL;
  const tooltipLabel = previewEffort?.name;
  const readOnly = driver === "composite";
  if (readOnly && typeof useProjection === "function") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CompositeLevelControl,
      {
        useProjection,
        weights,
        committedLevel,
        presenter,
        load,
        enabled,
        locale,
        t
      }
    );
  }
  if (readOnly) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-level-control flash-level-control--composite", "data-plugin": PACKAGE_ID, "data-state": "ready", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        className: "flash-level-control__range",
        type: "range",
        min: 0,
        max: MAX_LEVEL,
        step: 1,
        value: 0,
        disabled: true,
        tabIndex: -1,
        "aria-label": t ? t("driver.composite") : "\u7EFC\u5408\u52A0\u6743"
      }
    ) });
  }
  const commit = async (rawLevel) => {
    if (driver === "manual") {
      dragging.current = false;
      const next = clampLevel(rawLevel);
      setLevel(next);
      presenter.setLevel(next);
      return;
    }
    const targetIndex = nearestEffortIndex(rawLevel, efforts);
    const target = efforts[targetIndex];
    if (target === void 0) return;
    const targetLevel = levelForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setLevel(targetLevel);
    presenter.setLevel(targetLevel);
    if (targetIndex === committedIndex || pending) return;
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id
    });
    setPending(false);
    if (!accepted) {
      setFailed(true);
      setLevel(committedLevel);
      presenter.setLevel(committedLevel);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "flash-level-control",
      "data-plugin": PACKAGE_ID,
      "data-state": failed ? "error" : pending ? "pending" : "ready",
      title: driver === "effort" ? previewEffort?.name : void 0,
      children: [
        interacting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "output",
          {
            className: "flash-level-control__tooltip",
            style: { "--flash-slider-ratio": progressRatio },
            children: tooltipLabel ?? `${Math.round(progressRatio * 100)}%`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-level-control__ticks", "aria-hidden": "true", children: efforts.map((effort, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "i",
          {
            className: "flash-level-control__tick",
            style: { left: `${levelForEffort(index, efforts.length) / MAX_LEVEL * 100}%` }
          },
          effort.id
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            className: "flash-level-control__range",
            type: "range",
            min: 0,
            max: MAX_LEVEL,
            step: 1,
            value: level,
            disabled: pending || state.status === "selecting",
            "aria-label": driver === "effort" ? "\u63A8\u7406\u5F3A\u5EA6" : "\u76AE\u80A4\u5F3A\u5EA6",
            "aria-valuetext": driver === "effort" ? previewEffort?.name ?? "" : tooltipLabel ?? "",
            onPointerDown: () => {
              dragging.current = true;
              dragStartLevel.current = level;
              setInteracting(true);
            },
            onInput: (event) => {
              dragging.current = true;
              const next = Number(event.currentTarget.value);
              setLevel(next);
              presenter.setLevel(next);
            },
            onPointerUp: (event) => {
              setInteracting(false);
              void commit(Number(event.currentTarget.value));
            },
            onPointerCancel: () => {
              setInteracting(false);
              dragging.current = false;
              setLevel(dragStartLevel.current);
              presenter.setLevel(dragStartLevel.current);
            },
            onKeyUp: (event) => {
              setInteracting(false);
              if (event.key !== "Escape") void commit(Number(event.currentTarget.value));
            },
            onBlur: (event) => {
              setInteracting(false);
              if (dragging.current) void commit(Number(event.currentTarget.value));
            },
            onKeyDown: (event) => {
              setInteracting(true);
              if (event.key === "Escape" && !pending) {
                setInteracting(false);
                dragging.current = false;
                setLevel(dragStartLevel.current);
                presenter.setLevel(dragStartLevel.current);
              }
            }
          }
        )
      ]
    }
  );
}
function DriverRow({ scope, t }) {
  const snapshot = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  const [pending, setPending] = (0, import_react.useState)(false);
  if (!snapshot.enabled) return null;
  const options = [
    { value: "manual", label: t("driver.manual") },
    { value: "effort", label: t("driver.effort") },
    { value: "composite", label: t("driver.composite") }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-appearance-binding flash-appearance-binding--driver", "data-plugin": PACKAGE_ID, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-appearance-binding__label", children: t("driver.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-segmented", role: "radiogroup", "aria-label": t("driver.title"), children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": snapshot.driver === option.value,
        className: snapshot.driver === option.value ? "is-active" : void 0,
        disabled: pending,
        onClick: () => {
          if (pending || snapshot.driver === option.value) return;
          setPending(true);
          void scope.setDriver(option.value).catch(() => void 0).finally(() => setPending(false));
        },
        children: option.label
      },
      option.value
    )) })
  ] });
}
function CompositeLevelControl({
  useProjection,
  weights,
  committedLevel,
  presenter,
  load,
  enabled,
  locale,
  t
}) {
  const weightsSnapshot = (0, import_react.useSyncExternalStore)(
    (listener) => weights.subscribe(listener),
    () => weights.getSnapshot()
  );
  (0, import_react.useSyncExternalStore)(
    (listener) => locale?.subscribe ? locale.subscribe(listener) : () => void 0,
    () => locale?.getSnapshot ? locale.getSnapshot() : { active: "" }
  );
  const sessionStats = useProjection("sessionStats");
  const tokenUsage = useProjection("tokenUsage");
  const contextPressure = useProjection("contextPressure");
  const outputTokens = tokenUsage?.outputTokens;
  const pressureTokens = contextPressure?.projectedTokens ?? contextPressure?.pressureTokens;
  const contextWindow = contextPressure?.contextWindow;
  const turns = sessionStats?.turns;
  const decodeTokens = sessionStats?.decodeTokens;
  const decodeMs = sessionStats?.decodeMs;
  const normalized = normalizeWeights(weightsSnapshot);
  const usageF = usageFactor(outputTokens ?? 0);
  const pressureF = contextPressureFactor(pressureTokens, contextWindow, turns);
  const effortF = reasoningEffortFactor(committedLevel);
  const speedBase = tokenSpeedFactor(decodeTokens ?? 0, decodeMs ?? 0);
  const decodingActive = decodeTokens != null && Number.isFinite(decodeTokens) && decodeTokens > 0 && decodeMs != null && Number.isFinite(decodeMs) && decodeMs > 0;
  const tuning = weights.getTuning();
  const [now, setNow] = (0, import_react.useState)(() => Date.now());
  const lastDecodeAt = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [enabled]);
  (0, import_react.useEffect)(() => {
    if (decodingActive) lastDecodeAt.current = Date.now();
  }, [decodingActive, decodeTokens, decodeMs]);
  const speedF = speedBase > 0 && lastDecodeAt.current != null ? speedBase * freshnessDecay(now - lastDecodeAt.current, tuning.graceMs, tuning.fadeMs) : 0;
  const lastLevelRef = (0, import_react.useRef)(-1);
  (0, import_react.useEffect)(() => {
    if (enabled) load();
  }, [enabled, load]);
  (0, import_react.useEffect)(() => {
    const next = weightedLevel(weightsSnapshot, {
      usage: usageF,
      pressure: pressureF,
      effort: effortF,
      speed: speedF
    });
    if (lastLevelRef.current !== next) {
      lastLevelRef.current = next;
      presenter.setLevel(next);
    }
    if (presenter.isEnabled()) {
      presenter.setPortraitScore(
        weightsSnapshot.usage * usageF + weightsSnapshot.pressure * pressureF + weightsSnapshot.effort * effortF + weightsSnapshot.speed * speedF
      );
    }
  }, [
    presenter,
    weightsSnapshot,
    usageF,
    pressureF,
    effortF,
    speedF
  ]);
  const count = presenter.getPortraitCount();
  const w = normalized;
  const wSum = w.usage * usageF + w.pressure * pressureF + w.effort * effortF + w.speed * speedF;
  const frame = count > 0 ? frameIndexForScore(wSum, count) : 0;
  const fmt = (n) => Number(n.toFixed(2)).toString();
  const term = (weight, factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
    fmt(weight),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { className: "flash-level-control__mul", children: "\xB7" }),
    fmt(factor)
  ] });
  const terms = [
    [t ? t("weights.usageShort") : "\u7528\u91CF", "usage", w.usage, usageF],
    [t ? t("weights.pressureShort") : "\u538B\u529B", "pressure", w.pressure, pressureF],
    [t ? t("weights.effortShort") : "\u63A8\u7406", "effort", w.effort, effortF],
    [t ? t("weights.speedShort") : "\u901F\u5EA6", "speed", w.speed, speedF]
  ];
  const label = (key, fallback) => t ? t(key) : fallback;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "flash-level-control flash-level-control--composite",
      "data-plugin": PACKAGE_ID,
      "data-state": "ready",
      title: label("driver.composite", "\u7EFC\u5408\u52A0\u6743"),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("output", { className: "flash-level-control__gauge", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-level-control__formula", children: terms.map(([label2, id, weight, factor], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__term", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: label2 }),
            term(weight, factor)
          ] }),
          index < terms.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "flash-level-control__plus", children: "+" })
        ] }, id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__score", children: [
          label("weights.score", "\u5F97\u5206"),
          " ",
          fmt(wSum * MAX_LEVEL),
          " \xB7 ",
          count > 0 ? `${label("weights.frame", "\u5E27")} ${frame + 1}/${count}` : `${label("weights.frame", "\u5E27")} \u2014`
        ] })
      ] })
    }
  );
}
function PortraitSetRow({ scope, presenter, form, locale, t }) {
  const snapshot = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  const groupsSnapshot = (0, import_react.useSyncExternalStore)(
    (listener) => form?.subscribe ? form.subscribe(listener) : () => void 0,
    () => form?.getSnapshot ? form.getSnapshot() : void 0
  );
  const localeSnapshot = (0, import_react.useSyncExternalStore)(
    (listener) => locale?.subscribe ? locale.subscribe(listener) : () => void 0,
    () => locale?.getSnapshot ? locale.getSnapshot() : { active: "" }
  );
  const [pending, setPending] = (0, import_react.useState)(false);
  if (!snapshot.enabled) return null;
  const configured = groupsSnapshot?.status === "ready" ? groupsSnapshot.value?.portraitGroups ?? [] : [];
  const sets = (configured.length > 0 ? configured : [DEFAULT_PORTRAIT_SET]).map((set) => ({
    id: set.id,
    label: setDisplayName(set, localeSnapshot.active),
    frames: setFrames(set)
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flash-portrait-set", "data-plugin": PACKAGE_ID, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-portrait-set__label", children: t("appearance") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-appearance-sets", role: "radiogroup", "aria-label": t("appearance"), children: sets.map((set) => {
      const selected = snapshot.set === set.id;
      const frames = set.frames;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": selected,
          className: selected ? "flash-appearance-choice flash-appearance-choice--on" : "flash-appearance-choice",
          disabled: pending,
          onClick: () => {
            if (pending) return;
            setPending(true);
            void presenter.choose(set.id).catch(() => void 0).finally(() => setPending(false));
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-appearance-choice__identity", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-appearance-choice__icon", "aria-hidden": "true", children: "\u25C8" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-appearance-choice__label", children: set.label })
            ] }),
            frames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-appearance-choice__filmstrip", "aria-hidden": "true", children: frames.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "img",
              {
                className: "flash-appearance-choice__frame",
                src: url,
                alt: "",
                loading: "lazy",
                decoding: "async",
                onError: (event) => {
                  event.currentTarget.style.display = "none";
                }
              },
              index
            )) })
          ]
        },
        set.id
      );
    }) })
  ] });
}
var inject = [
  "slots",
  "sessions",
  "modelDirectories",
  "locale",
  "theme",
  "configForms"
];
function restoreInitialSet() {
  try {
    const id = normalizeSetId(localStorage.getItem(SET_KEY));
    if (id) return id;
  } catch {
  }
  return DEFAULT_PORTRAIT_SET.id;
}
function restoreDriver() {
  try {
    const raw = localStorage.getItem(DRIVER_KEY);
    if (raw === "manual" || raw === "effort" || raw === "composite") return raw;
    const legacy = localStorage.getItem(BIND_EFFORT_KEY);
    if (legacy !== null) return legacy === "0" ? "manual" : "effort";
  } catch {
  }
  return "composite";
}
function readWeightsState() {
  const fallback = {
    weights: { ...DEFAULT_COMPOSITE_WEIGHTS },
    tuning: { ...DEFAULT_SPEED_TUNING }
  };
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const tuning = normalizeTuning(parsed);
      return {
        weights: normalizeWeights(parsed),
        tuning
      };
    }
  } catch {
  }
  return fallback;
}
function normalizeTuning(tuning) {
  const clamp = (value, fallback) => Number.isFinite(value) && value > 0 ? Math.min(6e4, Math.max(0, value)) : fallback;
  return {
    graceMs: clamp(tuning?.graceMs, DEFAULT_SPEED_TUNING.graceMs),
    fadeMs: clamp(tuning?.fadeMs, DEFAULT_SPEED_TUNING.fadeMs)
  };
}
function createPreferenceStore(initialSet) {
  let snapshot = {
    enabled: true,
    set: initialSet ? initialSet : DEFAULT_PORTRAIT_SET.id,
    driver: restoreDriver()
  };
  const listeners = /* @__PURE__ */ new Set();
  const onStorage = (event) => {
    if (event.key !== SET_KEY && event.key !== DRIVER_KEY) return;
    const nextSetId = event.key === SET_KEY ? normalizeSetId(event.newValue) : void 0;
    const next = {
      enabled: snapshot.enabled,
      set: event.key === SET_KEY ? nextSetId ?? snapshot.set : snapshot.set,
      driver: event.key === DRIVER_KEY && (event.newValue === "manual" || event.newValue === "effort" || event.newValue === "composite") ? event.newValue : snapshot.driver
    };
    if (next.enabled === snapshot.enabled && next.set === snapshot.set && next.driver === snapshot.driver) return;
    snapshot = next;
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  const notify = () => {
    for (const listener of listeners) listener();
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async set(enabled) {
      if (enabled === snapshot.enabled) return;
      snapshot = { ...snapshot, enabled };
      notify();
    },
    async setSet(setId) {
      if (!setId || setId === snapshot.set) return;
      try {
        localStorage.setItem(SET_KEY, setId);
      } catch {
      }
      snapshot = { ...snapshot, set: setId };
      notify();
    },
    async setDriver(driver) {
      if (driver === snapshot.driver) return;
      try {
        localStorage.setItem(DRIVER_KEY, driver);
      } catch {
      }
      snapshot = { ...snapshot, driver };
      notify();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}
function createWeightsStore() {
  let state = readWeightsState();
  const listeners = /* @__PURE__ */ new Set();
  const onStorage = (event) => {
    if (event.key !== WEIGHTS_KEY) return;
    state = readWeightsState();
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  const notify = () => {
    for (const listener of listeners) listener();
  };
  const persist = () => {
    try {
      localStorage.setItem(WEIGHTS_KEY, JSON.stringify({
        ...state.weights,
        ...state.tuning
      }));
    } catch {
    }
  };
  return {
    getSnapshot: () => state.weights,
    getTuning: () => state.tuning,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setWeights(weights) {
      const next = normalizeWeights(weights);
      const same = next.usage === state.weights.usage && next.pressure === state.weights.pressure && next.effort === state.weights.effort && next.speed === state.weights.speed;
      if (same) return;
      state = { ...state, weights: next };
      persist();
      notify();
    },
    setTuning(tuning) {
      const next = normalizeTuning({ ...state.tuning, ...tuning });
      const same = next.graceMs === state.tuning.graceMs && next.fadeMs === state.tuning.fadeMs;
      if (same) return;
      state = { ...state, tuning: next };
      persist();
      notify();
    },
    reset() {
      const next = {
        weights: { ...DEFAULT_COMPOSITE_WEIGHTS },
        tuning: { ...DEFAULT_SPEED_TUNING }
      };
      const same = next.weights.usage === state.weights.usage && next.weights.pressure === state.weights.pressure && next.weights.effort === state.weights.effort && next.weights.speed === state.weights.speed && next.tuning.graceMs === state.tuning.graceMs && next.tuning.fadeMs === state.tuning.fadeMs;
      if (same) return;
      state = next;
      persist();
      notify();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}
var CONFIG_TEXTS = {
  zh: {
    "loading": "\u6B63\u5728\u52A0\u8F7D\u2026",
    "title": "\u8096\u50CF\u76AE\u80A4\u7EC4",
    "hint": "\u6BCF\u4E2A\u7EC4\u662F\u4E00\u7EC4\u6709\u5E8F\u56FE\u7247\uFF0C\u69FD\u4F4D\u4ECE\u5DE6\u5230\u53F3\u5BF9\u5E94\u63A8\u7406\u7B49\u7EA7\u7531\u4F4E\u5230\u9AD8\uFF0C\u7A7A\u69FD\u4F4D\u4F1A\u56DE\u9000\u5230\u9ED8\u8BA4\u7D20\u6750\u3002",
    "readOnly": "\u5F53\u524D\u6587\u6863\u4E0D\u5141\u8BB8\u5199\u5165\uFF0C\u8BF7\u5148\u5F00\u542F\u8FDE\u63A5\u6216\u6743\u9650\u3002",
    "openDetails": "Flash\u76AE\u80A4\u63D2\u4EF6\u914D\u7F6E",
    "openDetailsHint": "\u5728\u63D2\u4EF6\u7BA1\u7406\u9875\u6253\u5F00\u672C\u63D2\u4EF6\uFF08dsh-flash-skin\uFF09\u7684\u8BE6\u60C5\u3002",
    "empty": "\u8FD8\u6CA1\u6709\u4EFB\u4F55\u8096\u50CF\u76AE\u80A4\u7EC4\uFF0C\u4ECE\u538B\u7F29\u5305\u5BFC\u5165\u3001\u6216\u624B\u52A8\u6DFB\u52A0\u56FE\u7247\u6765\u521B\u5EFA\u4E00\u4E2A\u3002",
    "addGroup": "\u65B0\u5EFA\u76AE\u80A4\u7EC4",
    "renameGroup": "\u91CD\u547D\u540D\u76AE\u80A4\u7EC4",
    "namePlaceholder": "\u76AE\u80A4\u7EC4\u540D\u79F0",
    "deleteGroup": "\u5220\u9664\u7EC4",
    "moveGroupUp": "\u4E0A\u79FB",
    "moveGroupDown": "\u4E0B\u79FB",
    "moveImageLeft": "\u5DE6\u79FB",
    "moveImageRight": "\u53F3\u79FB",
    "replaceImage": "\u66FF\u6362",
    "removeImage": "\u79FB\u9664",
    "viewOriginal": "\u70B9\u51FB\u67E5\u770B\u539F\u56FE",
    "closePreview": "\u5173\u95ED\u9884\u89C8",
    "addImage": "\u6DFB\u52A0\u56FE\u7247",
    "pickLocalImage": "\u672C\u5730\u9009\u56FE",
    "pickLocalImageHint": "\u4ECE\u672C\u673A\u9009\u62E9\u4E00\u5F20\u56FE\u7247\uFF0C\u81EA\u52A8\u8F6C\u4E3A\u5185\u5D4C base64 \u586B\u5165\u3002",
    "imageUrlPlaceholder": "\u56FE\u7247 URL\uFF08http/https\uFF09",
    "confirm": "\u786E\u5B9A",
    "cancel": "\u53D6\u6D88",
    "urlEmpty": "\u8BF7\u8F93\u5165\u56FE\u7247 URL",
    "fileNotImage": "\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6",
    "fileTooLarge": "\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 2MB",
    "readFailed": "\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
    "defaultGroup": "\u65B0\u7684\u76AE\u80A4\u7EC4",
    "darkLevel": "\u6DF1\u6D45\u5207\u6362\u70B9",
    "darkLevelHint": "\u7528\u5DE6\u53F3\u7BAD\u5934\u9010\u6863\u79FB\u52A8\u6DF1\u6D45\u5207\u6362\u70B9\uFF1A\u7BAD\u5934\u5DE6\u4FA7\u4E3A\u6D45\u8272\u5916\u58F3\uFF0C\u53F3\u4FA7\u4E3A\u6DF1\u8272\u5916\u58F3\u3002",
    "dividerHint": "\u70B9\u51FB\u5206\u5272\u7EBF\u4E24\u4FA7\u7684\u5DE6\u53F3\u7BAD\u5934\uFF0C\u628A\u6DF1\u8272\u5916\u58F3\u7684\u8D77\u59CB\u6863\u4F4D\u9010\u6863\u8C03\u4F4E\u6216\u8C03\u9AD8\u3002",
    "dividerLeft": "\u6DF1\u8272\u5207\u6362\u70B9\u5DE6\u79FB\u4E00\u6863",
    "dividerRight": "\u6DF1\u8272\u5207\u6362\u70B9\u53F3\u79FB\u4E00\u6863",
    "setId": "\u6807\u8BC6\uFF08Set ID\uFF09",
    "setIdPlaceholder": "\u6807\u8BC6\uFF0C\u5982 liangsheng",
    "zhName": "\u4E2D\u6587\u540D\u79F0",
    "enName": "\u82F1\u6587\u540D\u79F0",
    "identityHint": "\u6807\u8BC6\uFF08Set ID\uFF09\u5199\u5165 localStorage \u6301\u4E45\u5316\u5F53\u524D\u9009\u62E9\uFF1A\u6539\u540D\u540E\u9700\u91CD\u65B0\u70B9\u51FB\u9009\u4E2D\u8BE5\u7EC4\u624D\u751F\u6548\uFF1B\u8BBE\u7F6E\u884C\u540D\u79F0\u6309\u754C\u9762\u8BED\u8A00\u663E\u793A\uFF08\u4E2D\u6587\u754C\u9762\u4E2D\u6587\u540D\uFF0C\u82F1\u6587\u754C\u9762\u82F1\u6587\u540D\uFF09\u3002\u5185\u7F6E\u7EC4\u7684\u9ED8\u8BA4\u4E2D/\u82F1\u6587\u540D\u4F1A\u5728\u672A\u4FEE\u6539\u65F6\u4E00\u76F4\u4F5C\u4E3A\u7F3A\u7701\u663E\u793A\u3002",
    "importGroup": "\u4ECE\u538B\u7F29\u5305\u5BFC\u5165\u65B0\u7EC4",
    "importGroupTitle": "\u9009\u62E9 .zip / .tar / .tar.gz\uFF0C\u628A\u5176\u4E2D\u6240\u6709\u56FE\u7247\u6279\u91CF\u5BFC\u5165\u4E3A\u4E00\u4E2A\u65B0\u7EC4\uFF1B\u82E5\u538B\u7F29\u5305\u5185\u542B portrait.yaml\uFF08\u6216 meta.yaml / \u540C\u540D .json\uFF09\u5143\u6570\u636E\uFF0C\u4F1A\u4E00\u5E76\u5BFC\u5165\u6807\u8BC6\u3001\u4E2D\u82F1\u6587\u540D\u79F0\u4E0E\u6DF1\u6D45\u5207\u6362\u70B9",
    "fileNotZip": "\u8BF7\u9009\u62E9 .zip / .tar / .tar.gz / .gz \u538B\u7F29\u5305",
    "zipNoImages": "\u538B\u7F29\u5305\u91CC\u6CA1\u6709\u53EF\u7528\u7684\u56FE\u7247",
    "zipParseFailed": "\u65E0\u6CD5\u89E3\u6790\u538B\u7F29\u5305\uFF0C\u8BF7\u786E\u8BA4\u5B83\u662F\u6709\u6548\u7684 .zip / .tar / .tar.gz \u6587\u4EF6",
    "zipTooManyImages": "\u5355\u6B21\u5BFC\u5165\u6700\u591A 64 \u5F20\uFF0C\u5DF2\u622A\u53D6\u524D 64 \u5F20",
    "zipSkippedOversize": "\u5DF2\u8DF3\u8FC7 {n} \u5F20\u8D85\u8FC7 2MB \u7684\u56FE\u7247",
    "zipImported": "\u5DF2\u5BFC\u5165 {n} \u5F20\u56FE\u7247\uFF0C\u521B\u5EFA\u4E86\u65B0\u7684\u76AE\u80A4\u7EC4",
    "zipImportedMeta": "\uFF0C\u5E76\u6309\u538B\u7F29\u5305\u5185\u5143\u6570\u636E\u8BBE\u7F6E\u4E86\u6807\u8BC6\u3001\u4E2D\u82F1\u6587\u540D\u79F0\u4E0E\u6DF1\u6D45\u5207\u6362\u70B9",
    "metaImported": "\u5DF2\u6309\u6E05\u5355\u521B\u5EFA\u65B0\u7EC4\uFF08{n} \u5F20\u5728\u7EBF\u56FE\u7247\uFF09",
    "importIdConflict": "\u6807\u8BC6\uFF08Set ID\uFF09\u300C{id}\u300D\u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u6362\u4E00\u4E2A\u552F\u4E00\u6807\u8BC6\u518D\u5BFC\u5165",
    "importConfirm": "\u5BFC\u5165",
    "importCancel": "\u53D6\u6D88",
    "importExamplesTitle": "\u5185\u7F6E\u793A\u4F8B\u5305",
    "importExamplesHint": "\u70B9\u51FB\u5373\u53EF\u628A\u5185\u7F6E\u793A\u4F8B\u5305\u5BFC\u5165\u4E3A\u4E00\u4E2A\u65B0\u7EC4\uFF1A",
    "importNetTitle": "\u6216\u4ECE\u7F51\u7EDC\u5BFC\u5165\u4EFB\u610F\u538B\u7F29\u5305",
    "netUrlPlaceholder": "\u7C98\u8D34\u538B\u7F29\u5305 URL\uFF08http/https\uFF0C.zip/.tar/.tar.gz\uFF09",
    "importNet": "\u4ECE\u7F51\u7EDC\u5BFC\u5165",
    "netEmpty": "\u8BF7\u8F93\u5165\u8981\u5BFC\u5165\u7684\u538B\u7F29\u5305 URL",
    "zipBadLink": "\u65E0\u6CD5\u5BFC\u5165\uFF1A\u8BF7\u8F93\u5165\u6307\u5411 .zip / .tar / .tar.gz \u7684 http/https \u94FE\u63A5"
  },
  en: {
    "loading": "Loading\u2026",
    "title": "Portrait groups",
    "hint": "Each group is an ordered set of images; slots run from low to high reasoning level left to right. Empty slots fall back to the default art.",
    "readOnly": "The current document does not accept writes; connect or grant permission first.",
    "openDetails": "Flash Skin plugin settings",
    "openDetailsHint": "Open this plugin's (dsh-flash-skin) detail page in the plugin manager.",
    "empty": "No portrait groups yet \u2014 import an archive, or create one from scratch.",
    "addGroup": "New group",
    "renameGroup": "Rename group",
    "namePlaceholder": "Group name",
    "deleteGroup": "Delete group",
    "moveGroupUp": "Move up",
    "moveGroupDown": "Move down",
    "moveImageLeft": "Move left",
    "moveImageRight": "Move right",
    "replaceImage": "Replace",
    "removeImage": "Remove",
    "viewOriginal": "Click to view original",
    "closePreview": "Close preview",
    "addImage": "Add image",
    "pickLocalImage": "Pick local image",
    "pickLocalImageHint": "Choose an image from this device; it is embedded as base64 automatically.",
    "imageUrlPlaceholder": "Image URL (http/https)",
    "confirm": "OK",
    "cancel": "Cancel",
    "urlEmpty": "Enter an image URL",
    "fileNotImage": "Please choose an image file",
    "fileTooLarge": "Image must be 2MB or smaller",
    "readFailed": "Failed to read the image, please retry",
    "defaultGroup": "New group",
    "darkLevel": "Light/dark threshold",
    "darkLevelHint": "Use the arrows to move the light/dark threshold one level at a time: images to their left keep the light shell, images to their right switch to dark.",
    "dividerHint": "Click the arrows beside the divider to raise or lower the slider level at which the dark shell begins.",
    "dividerLeft": "Move threshold left",
    "dividerRight": "Move threshold right",
    "setId": "Set ID (identifier)",
    "setIdPlaceholder": "Identifier, e.g. liangsheng",
    "zhName": "Chinese name",
    "enName": "English name",
    "identityHint": "The Set ID is persisted in localStorage for the current selection \u2014 after renaming, click the group again to take effect. The settings row shows the Chinese name in the Chinese UI and the English name in the English UI. Built-in sets keep their default Chinese/English names as fallbacks until overridden.",
    "importGroup": "Import group from archive",
    "importGroupTitle": "Choose a .zip / .tar / .tar.gz; all images inside are batch-imported as a new group. A portrait.yaml (or meta.yaml / matching .json) inside the archive also seeds the group's id, Chinese/English names and light/dark threshold",
    "fileNotZip": "Please choose a .zip / .tar / .tar.gz / .gz archive",
    "zipNoImages": "The archive contains no usable images",
    "zipParseFailed": "Could not parse the archive \u2014 make sure it is a valid .zip / .tar / .tar.gz file",
    "zipTooManyImages": "At most 64 images per import; kept the first 64",
    "zipSkippedOversize": "Skipped {n} images over 2MB",
    "zipImported": "Imported {n} images and created a new group",
    "zipImportedMeta": ", and set the id, Chinese/English names and light/dark threshold from the archive metadata",
    "metaImported": "Created a new group from the manifest metadata with {n} image URLs",
    "importIdConflict": 'Set ID "{id}" is already in use \u2014 pick a unique one before importing',
    "importConfirm": "Import",
    "importCancel": "Cancel",
    "importExamplesTitle": "Bundled examples",
    "importExamplesHint": "Click to import a bundled example as a new group:",
    "importNetTitle": "Or import any archive from the network",
    "netUrlPlaceholder": "Paste an archive URL (http/https, .zip/.tar/.tar.gz)",
    "importNet": "Import from network",
    "netEmpty": "Enter the archive URL to import",
    "zipBadLink": "Could not import: please paste an http(s) link to a .zip / .tar / .tar.gz archive"
  }
};
function newGroupId() {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `group-${random}`;
}
var MAX_LOCAL_IMAGE_BYTES = 2 * 1024 * 1024;
function readLocalFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
var MAX_IMAGES_PER_IMPORT = 64;
var IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
function mediaTypeForEntry(name, bytes) {
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    return "image/jpeg";
  }
  if (bytes.length >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) {
    return "image/webp";
  }
  if (bytes.length >= 6 && (bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70 && (bytes[3] === 56 && bytes[4] === 55 || bytes[3] === 56 && bytes[4] === 57) && bytes[5] === 97)) {
    return "image/gif";
  }
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  return MEDIA_TYPE_BY_EXT[ext] ?? "image/png";
}
function readLocalFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
function entriesFromZip(buffer) {
  const files = unzipSync(new Uint8Array(buffer));
  const entries = [];
  for (const raw of Object.keys(files)) {
    const bytes = files[raw];
    if (!bytes || bytes.length === 0) continue;
    entries.push({ name: raw, bytes });
  }
  return entries;
}
var PORTRAIT_META_FILES = /* @__PURE__ */ new Set([
  "portrait.yaml",
  "portrait.yml",
  "portrait.json",
  "meta.yaml",
  "meta.yml",
  "meta.json"
]);
function findImportMeta(rawEntries) {
  for (const raw of rawEntries) {
    const base = raw.name.split("/").pop() ?? raw.name;
    if (!PORTRAIT_META_FILES.has(base.toLowerCase())) continue;
    let text;
    try {
      text = new TextDecoder().decode(raw.bytes);
    } catch {
      continue;
    }
    const meta = parseImportMetaText(text);
    if (meta) return meta;
  }
  return null;
}
function parseTar(archive) {
  const entries = [];
  let offset = 0;
  while (offset + 512 <= archive.length) {
    const header = archive.subarray(offset, offset + 512);
    if (isAllZeroes(header)) break;
    const name = decodeTarString(header, 0, 100);
    const typeflag = String.fromCharCode(header[156] ?? 0);
    const sizeOct = decodeTarString(header, 124, 12).trim().split("\0")[0] || "0";
    const size = parseInt(sizeOct, 8) || 0;
    offset += 512;
    if (!name || name === "." || name === "..") {
      offset += Math.ceil(size / 512) * 512;
      continue;
    }
    if (typeflag === "0" || typeflag === "\0" || typeflag === "") {
      const payload = archive.subarray(offset, offset + size);
      if (payload.length === size) entries.push({ name, bytes: new Uint8Array(payload) });
    }
    offset += Math.ceil(size / 512) * 512;
  }
  return entries;
}
function decodeTarString(bytes, start, length) {
  let end = start;
  while (end < start + length && bytes[end] !== 0) end += 1;
  return new TextDecoder().decode(bytes.subarray(start, end)).trim();
}
function isAllZeroes(bytes) {
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] !== 0) return false;
  }
  return true;
}
function maybeGunzip(bytes) {
  if (bytes.length >= 2 && bytes[0] === 31 && bytes[1] === 139) {
    return gunzipSync(bytes);
  }
  return bytes;
}
function collectImages(rawEntries) {
  const entries = [];
  const nameCounts = /* @__PURE__ */ new Map();
  let skippedOversize = 0;
  for (const rawEntry of rawEntries) {
    if (entries.length >= MAX_IMAGES_PER_IMPORT) break;
    const base = rawEntry.name.split("/").pop() ?? rawEntry.name;
    if (!base || /^\./.test(base)) continue;
    const dot = base.lastIndexOf(".");
    if (dot < 0) continue;
    const ext = base.slice(dot).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    if (rawEntry.bytes.length > MAX_LOCAL_IMAGE_BYTES) {
      skippedOversize += 1;
      continue;
    }
    const stem = base.slice(0, dot);
    const used = nameCounts.get(base) ?? 0;
    nameCounts.set(base, used + 1);
    entries.push({ name: used === 0 ? base : `${stem}-${used + 1}${ext}`, bytes: rawEntry.bytes });
  }
  return { entries, skippedOversize };
}
function extractArchive(fileName, buffer) {
  const lower = fileName.toLowerCase();
  let rawEntries;
  if (lower.endsWith(".zip")) {
    rawEntries = entriesFromZip(buffer);
  } else if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
    const bytes = maybeGunzip(new Uint8Array(buffer));
    rawEntries = parseTar(bytes);
  } else if (lower.endsWith(".tar")) {
    rawEntries = parseTar(new Uint8Array(buffer));
  } else if (lower.endsWith(".gz") || lower.endsWith(".gzip")) {
    const bytes = maybeGunzip(new Uint8Array(buffer));
    rawEntries = [{ name: fileName.replace(/\.(gz|gzip)$/i, ""), bytes }];
  } else {
    rawEntries = [];
  }
  const collected = collectImages(rawEntries);
  return {
    entries: collected.entries,
    skippedOversize: collected.skippedOversize,
    meta: findImportMeta(rawEntries)
  };
}
function bytesToBase64(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  }
  return btoa(binary);
}
async function postImageBatch(batch) {
  const images = batch.map((entry) => ({
    name: entry.name,
    mediaType: mediaTypeForEntry(entry.name, entry.bytes),
    data: bytesToBase64(entry.bytes)
  }));
  const response = await fetch(ATTACHMENT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images })
  });
  if (!response.ok) throw new Error(`attachment upload ${response.status}`);
  const payload = await response.json();
  const urls = Array.isArray(payload.images) ? payload.images.map((entry) => entry.url).filter((url) => typeof url === "string" && url.length > 0) : [];
  if (urls.length !== images.length) throw new Error("attachment upload truncated");
  return urls;
}
async function uploadArchiveImages(entries) {
  const urls = [];
  for (let start = 0; start < entries.length; start += MAX_UPLOAD_IMAGES_PER_BATCH) {
    const urlsForBatch = await postImageBatch(entries.slice(start, start + MAX_UPLOAD_IMAGES_PER_BATCH));
    urls.push(...urlsForBatch);
  }
  return urls;
}
function boundaryForDarkLevel(count, level) {
  if (count <= 0) return 0;
  return Math.min(count, Math.max(0, Math.round(level / MAX_LEVEL * count)));
}
function FlashSkinConfigCard({ form, weights, t: localeT }) {
  const snapshot = (0, import_react.useSyncExternalStore)(
    (listener) => form.subscribe(listener),
    () => form.getSnapshot()
  );
  const weightSnapshot = (0, import_react.useSyncExternalStore)(
    (listener) => weights.subscribe(listener),
    () => weights.getSnapshot()
  );
  const tuningSnapshot = (0, import_react.useSyncExternalStore)(
    (listener) => weights.subscribe(listener),
    () => weights.getTuning()
  );
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [editing, setEditing] = (0, import_react.useState)(null);
  const fileInputRef = (0, import_react.useRef)(null);
  const pendingPick = (0, import_react.useRef)(null);
  const [fileError, setFileError] = (0, import_react.useState)(null);
  const [pendingImport, setPendingImport] = (0, import_react.useState)(null);
  const [preview, setPreview] = (0, import_react.useState)(null);
  const [hintSeen, setHintSeen] = (0, import_react.useState)(
    () => typeof localStorage !== "undefined" ? localStorage.getItem("flash-skin:preview-hint-seen") === "1" : false
  );
  const markHintSeen = () => {
    if (hintSeen) return;
    setHintSeen(true);
    try {
      localStorage.setItem("flash-skin:preview-hint-seen", "1");
    } catch {
    }
  };
  const t = (key) => {
    if (typeof localeT === "function") return localeT(key);
    return CONFIG_TEXTS.en[key] ?? key;
  };
  const groups = snapshot.value?.portraitGroups ?? [];
  const ready = snapshot.status === "ready";
  const writable = snapshot.writable;
  const commit = async (next, expectedRevision) => {
    if (busy) return;
    setBusy(true);
    try {
      await form.mutate(
        [{ op: "set", path: ["portraitGroups"], value: next }],
        expectedRevision ?? snapshot.revision
      );
    } catch {
    } finally {
      setBusy(false);
      setEditing(null);
    }
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "flash-portrait-groups", "data-plugin": PACKAGE_ID, "data-state": "loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", children: t("loading") }) });
  }
  const withGroup = (groupIndex, update) => {
    const next = groups.slice();
    next[groupIndex] = update(next[groupIndex]);
    return next;
  };
  const stepDivider = (groupIndex, delta) => {
    if (!writable || busy) return;
    const group = groups[groupIndex];
    const current = group?.darkLevel ?? MAX_LEVEL - 1;
    const step = dividerStepFor(group?.images?.length ?? 0);
    const next = Math.round(clampLevelContinuous(current + delta * step) * 1e3) / 1e3;
    if (next !== current) {
      void commit(withGroup(groupIndex, (g) => ({ ...g, darkLevel: next })));
    }
  };
  const renderDivider = (dividerKey, groupIndex, effectiveDark) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "li",
    {
      className: "flash-portrait-group__divider",
      "aria-label": t("darkLevel"),
      title: t("darkLevelHint"),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "flash-portrait-group__divider-arrow",
            "aria-label": t("dividerLeft"),
            disabled: !writable || busy || effectiveDark <= 0,
            onClick: () => stepDivider(groupIndex, -1),
            children: "\u25C0"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-group__divider-handle", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "flash-portrait-group__divider-arrow",
            "aria-label": t("dividerRight"),
            disabled: !writable || busy || effectiveDark >= MAX_LEVEL,
            onClick: () => stepDivider(groupIndex, 1),
            children: "\u25B6"
          }
        )
      ]
    },
    dividerKey
  );
  const commitField = (groupIndex, kind, raw) => {
    const trimmed = raw.trim();
    const group = groups[groupIndex];
    if (!group) return;
    if (kind === "id" && trimmed === "") return;
    const def = defaultSetIdentity(group.id);
    if (kind === "id" && trimmed === group.id || kind === "zh" && trimmed === (group.zh?.trim() ?? def?.zh ?? group.name) || kind === "en" && trimmed === (group.en?.trim() ?? def?.en ?? group.name)) return;
    const next = withGroup(groupIndex, (g) => {
      if (kind === "id") return { ...g, id: trimmed };
      if (kind === "zh") return { ...g, zh: trimmed || void 0 };
      return { ...g, en: trimmed || void 0 };
    });
    void commit(next);
  };
  const deleteGroup = (groupIndex) => {
    void commit(groups.filter((_, index) => index !== groupIndex));
  };
  const addGroup = () => {
    const next = [...groups, {
      id: newGroupId(),
      name: CONFIG_TEXTS.zh.defaultGroup,
      zh: CONFIG_TEXTS.zh.defaultGroup,
      en: CONFIG_TEXTS.en.defaultGroup,
      images: []
    }];
    void commit(next);
  };
  const moveGroup = (groupIndex, delta) => {
    const targetIndex = groupIndex + delta;
    const target = groups[targetIndex];
    if (target === void 0) return;
    const next = groups.slice();
    next[groupIndex] = target;
    next[targetIndex] = groups[groupIndex];
    void commit(next);
  };
  const addImage = (groupIndex, url) => {
    const trimmed = url.trim();
    if (trimmed === "") return;
    const next = withGroup(groupIndex, (group) => ({ ...group, images: [...group.images, trimmed] }));
    void commit(next);
  };
  const removeImage = (groupIndex, imageIndex) => {
    const next = withGroup(groupIndex, (group) => ({
      ...group,
      images: group.images.filter((_, index) => index !== imageIndex)
    }));
    void commit(next);
  };
  const moveImage = (groupIndex, imageIndex, delta) => {
    const targetIndex = imageIndex + delta;
    const images = groups[groupIndex]?.images;
    const target = images?.[targetIndex];
    if (target === void 0) return;
    const next = withGroup(groupIndex, (group) => {
      const nextImages = group.images.slice();
      nextImages[imageIndex] = target;
      nextImages[targetIndex] = group.images[imageIndex];
      return { ...group, images: nextImages };
    });
    void commit(next);
  };
  const replaceImage = (groupIndex, imageIndex, url) => {
    const trimmed = url.trim();
    if (trimmed === "") return;
    const next = withGroup(groupIndex, (group) => ({
      ...group,
      images: group.images.map((src, index) => index === imageIndex ? trimmed : src)
    }));
    void commit(next);
  };
  const openLocalPicker = (kind, groupIndex, imageIndex) => {
    if (!writable || busy) return;
    pendingPick.current = { kind, groupIndex, imageIndex };
    fileInputRef.current?.click();
  };
  const onFileInputChange = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (file === void 0) return;
    const pick = pendingPick.current;
    pendingPick.current = null;
    if (!pick) return;
    if (!file.type.startsWith("image/")) {
      setFileError(t("fileNotImage"));
      return;
    }
    if (file.size > MAX_LOCAL_IMAGE_BYTES) {
      setFileError(t("fileTooLarge"));
      return;
    }
    try {
      const dataUrl = await readLocalFile(file);
      setFileError(null);
      if (pick.kind === "replace" && pick.imageIndex !== void 0) {
        replaceImage(pick.groupIndex, pick.imageIndex, dataUrl);
      } else {
        addImage(pick.groupIndex, dataUrl);
      }
    } catch {
      setFileError(t("readFailed"));
    }
  };
  const archiveInputRef = (0, import_react.useRef)(null);
  const importArchive = () => {
    if (!writable || busy) return;
    archiveInputRef.current?.click();
  };
  const insertImportedGroup = (images, meta) => {
    const defaultZh = CONFIG_TEXTS.zh.defaultGroup;
    const defaultEn = CONFIG_TEXTS.en.defaultGroup;
    const baseId = meta?.id && meta.id.length > 0 ? meta.id : newGroupId();
    const existingIds = new Set(groups.map((group) => group.id));
    let id = baseId;
    for (let suffix = 2; existingIds.has(id); suffix += 1) {
      id = `${baseId}-${suffix}`;
    }
    const zh2 = meta?.zh || defaultZh;
    const en = meta?.en || defaultEn;
    const next = [...groups, {
      id,
      name: zh2,
      zh: zh2,
      en,
      darkLevel: meta?.darkLevel ?? MAX_LEVEL - 1,
      images
    }];
    void commit(next);
  };
  const onArchiveInputChange = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (file === void 0) return;
    if (!ARCHIVE_EXT_RE.test(file.name)) {
      setFileError(t("fileNotZip"));
      return;
    }
    let buffer;
    try {
      buffer = await readLocalFileAsArrayBuffer(file);
    } catch {
      setFileError(t("zipParseFailed"));
      return;
    }
    await runArchiveImport(file.name, buffer);
  };
  const runArchiveImport = async (name, buffer) => {
    if (!writable || busy) return;
    setBusy(true);
    try {
      let entries;
      let skippedOversize;
      let meta = null;
      try {
        const parsed = extractArchive(name, buffer);
        entries = parsed.entries;
        skippedOversize = parsed.skippedOversize;
        meta = parsed.meta;
      } catch {
        setFileError(t("zipParseFailed"));
        return;
      }
      const manifestImages = meta?.images ?? [];
      if (entries.length === 0 && manifestImages.length === 0) {
        setFileError(
          skippedOversize > 0 ? t("zipSkippedOversize").replace("{n}", String(skippedOversize)) : t("zipNoImages")
        );
        return;
      }
      try {
        let images;
        let notice;
        if (entries.length > 0) {
          images = await uploadArchiveImages(entries);
          notice = t("zipImported").replace("{n}", String(images.length));
        } else {
          images = manifestImages;
          notice = t("metaImported").replace("{n}", String(images.length));
        }
        if (meta) {
          notice += " " + t("zipImportedMeta");
        }
        if (skippedOversize > 0) {
          notice += " " + t("zipSkippedOversize").replace("{n}", String(skippedOversize));
        }
        if (meta?.id && groups.some((group) => group.id === meta.id)) {
          setPendingImport({
            images,
            meta,
            originalId: meta.id,
            draftId: suggestUniqueId(meta.id),
            notice
          });
          return;
        }
        insertImportedGroup(images, meta ?? void 0);
        setFileError(notice);
      } catch {
        setFileError(t("zipParseFailed"));
      } finally {
        setBusy(false);
      }
    } finally {
      setBusy(false);
    }
  };
  const importFromUrl = async (rawUrl) => {
    if (!writable || busy) return;
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      setFileError(t("netEmpty"));
      return;
    }
    let name;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setFileError(t("zipBadLink"));
        return;
      }
      name = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() ?? "");
    } catch {
      setFileError(t("zipBadLink"));
      return;
    }
    if (!ARCHIVE_EXT_RE.test(name)) {
      setFileError(t("zipBadLink"));
      return;
    }
    setFileError(null);
    setBusy(true);
    try {
      const response = await fetch(`${REMOTE_ARCHIVE_PATH}?url=${encodeURIComponent(trimmed)}`);
      if (!response.ok) throw new Error(`archive fetch ${response.status}`);
      const buffer = await response.arrayBuffer();
      await runArchiveImport(name, buffer);
    } catch {
      setFileError(t("zipParseFailed"));
    } finally {
      setBusy(false);
    }
  };
  const importExample = async (file) => {
    if (!writable || busy) return;
    setFileError(null);
    setBusy(true);
    try {
      const response = await fetch(EXAMPLES_PREFIX + file);
      if (!response.ok) throw new Error(`example fetch ${response.status}`);
      const buffer = await response.arrayBuffer();
      await runArchiveImport(file, buffer);
    } catch {
      setFileError(t("zipParseFailed"));
    } finally {
      setBusy(false);
    }
  };
  const [netUrl, setNetUrl] = (0, import_react.useState)("");
  const suggestUniqueId = (baseId) => {
    if (!groups.some((group) => group.id === baseId)) return baseId;
    for (let suffix = 2; ; suffix += 1) {
      const candidate = `${baseId}-${suffix}`;
      if (!groups.some((group) => group.id === candidate)) return candidate;
    }
  };
  const confirmImport = () => {
    if (!pendingImport) return;
    const draftId = pendingImport.draftId.trim();
    if (!draftId) return;
    if (groups.some((group) => group.id === draftId)) {
      setPendingImport({ ...pendingImport, draftId: suggestUniqueId(draftId) });
      return;
    }
    const meta = { ...pendingImport.meta, id: draftId };
    insertImportedGroup(pendingImport.images, meta);
    setFileError(pendingImport.notice);
    setPendingImport(null);
  };
  const cancelImport = () => {
    setPendingImport(null);
    setFileError(null);
  };
  const identityInput = (groupIndex, kind) => {
    const group = groups[groupIndex];
    if (!group) return null;
    const editingField = editing?.kind === kind && editing.groupIndex === groupIndex;
    const def = defaultSetIdentity(group.id);
    const current = kind === "id" ? group.id : kind === "zh" ? group.zh?.trim() ?? def?.zh ?? group.name : group.en?.trim() ?? def?.en ?? group.name;
    const caption = kind === "id" ? t("setId") : kind === "zh" ? t("zhName") : t("enName");
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: kind === "id" ? "flash-portrait-group__field flash-portrait-group__field--id" : "flash-portrait-group__field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-group__field-caption", children: caption }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: kind === "id" ? "flash-portrait-group__name flash-portrait-group__name--id" : "flash-portrait-group__name flash-portrait-group__name--lang",
          placeholder: kind === "id" ? t("setIdPlaceholder") : void 0,
          value: editingField ? editing.value : current,
          disabled: !writable || busy,
          onFocus: () => setEditing({ kind, groupIndex, value: current }),
          onChange: (event) => setEditing({ kind, groupIndex, value: event.currentTarget.value }),
          onBlur: () => {
            if (editingField) commitField(groupIndex, kind, editing.value);
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") setEditing(null);
          }
        }
      )
    ] }, kind);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flash-portrait-groups", "data-plugin": PACKAGE_ID, "data-state": writable ? "ready" : "readonly", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "flash-portrait-groups__head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "flash-portrait-groups__title", children: t("title") }),
      !writable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", role: "status", children: t("readOnly") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        hidden: true,
        "aria-hidden": "true",
        tabIndex: -1,
        onChange: onFileInputChange
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        ref: archiveInputRef,
        type: "file",
        accept: ".zip,.tar,.tar.gz,.tgz,.gz,application/zip,application/x-zip-compressed,application/x-tar,application/gzip,application/x-gzip",
        hidden: true,
        "aria-hidden": "true",
        tabIndex: -1,
        onChange: onArchiveInputChange
      }
    ),
    fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: fileError }),
    pendingImport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: "flash-portrait-groups__conflict",
        role: "dialog",
        "aria-label": t("importIdConflict").replace("{id}", pendingImport.originalId),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: t("importIdConflict").replace("{id}", pendingImport.originalId) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-groups__conflict-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flash-portrait-group__field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-group__field-caption", children: t("setId") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "input",
                {
                  className: "flash-portrait-group__name flash-portrait-group__name--id",
                  value: pendingImport.draftId,
                  onChange: (event) => setPendingImport({ ...pendingImport, draftId: event.currentTarget.value }),
                  onBlur: () => {
                    const trimmed = pendingImport.draftId.trim();
                    if (!trimmed) return;
                    setPendingImport({
                      ...pendingImport,
                      draftId: groups.some((group) => group.id === trimmed) ? suggestUniqueId(trimmed) : trimmed
                    });
                  }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-group__actions", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  disabled: !pendingImport.draftId.trim() || groups.some((group) => group.id === pendingImport.draftId.trim()),
                  onClick: confirmImport,
                  children: t("importConfirm")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "flash-portrait-group__danger", onClick: cancelImport, children: t("importCancel") })
            ] })
          ] })
        ]
      }
    ),
    groups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-portrait-groups__empty", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("empty") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { className: "flash-portrait-groups__groups", children: groups.map((group, groupIndex) => {
      const editingAdd = editing?.kind === "add" && editing.groupIndex === groupIndex;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flash-portrait-group", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "flash-portrait-group__head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-group__identity", children: [
            identityInput(groupIndex, "id"),
            identityInput(groupIndex, "zh"),
            identityInput(groupIndex, "en")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-group__actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                title: t("moveGroupUp"),
                disabled: !writable || busy || groupIndex === 0,
                onClick: () => moveGroup(groupIndex, -1),
                children: t("moveGroupUp")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                title: t("moveGroupDown"),
                disabled: !writable || busy || groupIndex === groups.length - 1,
                onClick: () => moveGroup(groupIndex, 1),
                children: t("moveGroupDown")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "flash-portrait-group__danger",
                disabled: !writable || busy,
                onClick: () => deleteGroup(groupIndex),
                children: t("deleteGroup")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint flash-portrait-group__divider-hint", children: t("dividerHint") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "ol",
          {
            className: "flash-portrait-group__images",
            children: [
              group.images.map((src, imageIndex) => {
                const editingReplace = editing?.kind === "replace" && editing.groupIndex === groupIndex && editing.imageIndex === imageIndex;
                const count = group.images.length;
                const effectiveDark = group.darkLevel ?? MAX_LEVEL - 1;
                const boundary = boundaryForDarkLevel(count, effectiveDark);
                return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
                  imageIndex === boundary && count > 0 && renderDivider(imageIndex, groupIndex, effectiveDark),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "flash-portrait-group__image", children: editingReplace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        className: "flash-portrait-group__url",
                        autoFocus: true,
                        placeholder: t("imageUrlPlaceholder"),
                        value: editing.value,
                        onChange: (event) => setEditing({
                          kind: "replace",
                          groupIndex,
                          imageIndex,
                          value: event.currentTarget.value
                        }),
                        onKeyDown: (event) => {
                          if (event.key === "Enter") replaceImage(groupIndex, imageIndex, editing.value);
                          if (event.key === "Escape") setEditing(null);
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        type: "button",
                        disabled: !writable || busy || editing.value.trim() === "",
                        onClick: () => replaceImage(groupIndex, imageIndex, editing.value),
                        children: t("confirm")
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        type: "button",
                        title: t("pickLocalImageHint"),
                        disabled: !writable || busy,
                        onClick: () => openLocalPicker("replace", groupIndex, imageIndex),
                        children: t("pickLocalImage")
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy, onClick: () => setEditing(null), children: t("cancel") })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "img",
                      {
                        src,
                        loading: "lazy",
                        alt: "",
                        draggable: false,
                        className: "flash-portrait-group__img" + (hintSeen ? " flash-portrait-group__img--hinted" : ""),
                        onClick: () => {
                          setPreview(src);
                          markHintSeen();
                        },
                        onError: (event) => {
                          event.currentTarget.style.opacity = "0.25";
                        }
                      }
                    ),
                    !hintSeen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-group__preview-hint", role: "status", children: t("viewOriginal") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-group__image-index", children: imageIndex + 1 }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-group__image-actions", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          title: t("moveImageLeft"),
                          disabled: !writable || busy || imageIndex === 0,
                          onClick: () => moveImage(groupIndex, imageIndex, -1),
                          children: t("moveImageLeft")
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          title: t("moveImageRight"),
                          disabled: !writable || busy || imageIndex === group.images.length - 1,
                          onClick: () => moveImage(groupIndex, imageIndex, 1),
                          children: t("moveImageRight")
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          disabled: !writable || busy,
                          onClick: () => setEditing({ kind: "replace", groupIndex, imageIndex, value: group.images[imageIndex] }),
                          children: t("replaceImage")
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "flash-portrait-group__danger",
                          disabled: !writable || busy,
                          onClick: () => removeImage(groupIndex, imageIndex),
                          children: t("removeImage")
                        }
                      )
                    ] })
                  ] }) })
                ] }, imageIndex);
              }),
              (() => {
                const count = group.images.length;
                const effectiveDark = group.darkLevel ?? MAX_LEVEL - 1;
                return boundaryForDarkLevel(count, effectiveDark) >= count ? renderDivider(count, groupIndex, effectiveDark) : null;
              })(),
              editingAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flash-portrait-group__image flash-portrait-group__add", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    className: "flash-portrait-group__url",
                    autoFocus: true,
                    placeholder: t("imageUrlPlaceholder"),
                    value: editing.value,
                    onChange: (event) => setEditing({ kind: "add", groupIndex, value: event.currentTarget.value }),
                    onKeyDown: (event) => {
                      if (event.key === "Enter") addImage(groupIndex, editing.value);
                      if (event.key === "Escape") setEditing(null);
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    disabled: !writable || busy || editing.value.trim() === "",
                    onClick: () => addImage(groupIndex, editing.value),
                    children: t("confirm")
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    title: t("pickLocalImageHint"),
                    disabled: !writable || busy,
                    onClick: () => openLocalPicker("add", groupIndex),
                    children: t("pickLocalImage")
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy, onClick: () => setEditing(null), children: t("cancel") })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flash-portrait-group__image flash-portrait-group__add", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "button",
                  {
                    type: "button",
                    disabled: !writable || busy,
                    onClick: () => setEditing({ kind: "add", groupIndex, value: "" }),
                    children: [
                      "+ ",
                      t("addImage")
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "flash-portrait-group__add-pick",
                    title: t("pickLocalImageHint"),
                    disabled: !writable || busy,
                    onClick: () => openLocalPicker("add", groupIndex),
                    children: t("pickLocalImage")
                  }
                )
              ] })
            ]
          }
        )
      ] }, group.id);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: "flash-portrait-groups__foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", disabled: !writable || busy, onClick: addGroup, children: [
        "+ ",
        t("addGroup")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          disabled: !writable || busy,
          onClick: importArchive,
          title: t("importGroupTitle"),
          "aria-label": t("importGroupTitle"),
          children: t("importGroup")
        }
      ),
      busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-groups__notice", role: "status", children: "\u2026" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-import-net", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-import-net__examples", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-import-net__label", children: t("importExamplesTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-import-net__row", children: EXAMPLE_ARCHIVES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "flash-import-net__example",
            disabled: !writable || busy,
            onClick: () => void importExample(example.file),
            title: `${example.file} \u2014 ${example.zh} \xB7 ${example.en}`,
            children: [
              example.zh,
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: example.en })
            ]
          },
          example.file
        )) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "form",
        {
          className: "flash-import-net__url",
          onSubmit: (event) => {
            event.preventDefault();
            void importFromUrl(netUrl);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-import-net__label", children: t("importNetTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "input",
              {
                type: "text",
                className: "flash-weights__input",
                placeholder: t("netUrlPlaceholder"),
                value: netUrl,
                disabled: !writable || busy,
                onChange: (event) => setNetUrl(event.currentTarget.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "submit", disabled: !writable || busy || netUrl.trim() === "", children: t("importNet") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flash-weights", "data-plugin": PACKAGE_ID, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { className: "flash-weights__head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "flash-weights__title", children: t("weights.title") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("weights.hint") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-weights__grid", children: [
        ["usage", "usage", "usageDesc", weightSnapshot.usage],
        ["pressure", "pressure", "pressureDesc", weightSnapshot.pressure],
        ["effort", "effort", "effortDesc", weightSnapshot.effort],
        ["speed", "speed", "speedDesc", weightSnapshot.speed]
      ].map(([key, labelKey, descKey, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flash-weights__field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-weights__caption", children: t(`weights.${labelKey}`) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "number",
            className: "flash-weights__input",
            min: 0,
            max: 1,
            step: 0.05,
            value: value.toFixed(2) ?? "",
            disabled: !writable || busy,
            onChange: (event) => {
              const parsed = Number(event.currentTarget.value);
              const clamped = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
              weights.setWeights({ ...weightSnapshot, [key]: clamped });
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-weights__desc", children: t(`weights.${descKey}`) })
      ] }, key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-weights__subtitle", children: t("weights.speedTiming") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-weights__grid", children: [
        ["graceMs", "weights.graceMs", tuningSnapshot.graceMs],
        ["fadeMs", "weights.fadeMs", tuningSnapshot.fadeMs]
      ].map(([key, labelKey, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flash-weights__field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-weights__caption", children: t(labelKey) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "number",
            className: "flash-weights__input",
            min: 0,
            max: 6e4,
            step: 100,
            value: Math.round(value),
            disabled: !writable || busy,
            onChange: (event) => {
              const parsed = Number(event.currentTarget.value);
              const clamped = Number.isFinite(parsed) ? Math.min(6e4, Math.max(0, parsed)) : 0;
              weights.setTuning({ [key]: clamped });
            }
          }
        )
      ] }, key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "flash-weights__reset",
          disabled: !writable || busy,
          onClick: () => weights.reset(),
          children: t("weights.reset")
        }
      )
    ] }),
    preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: "flash-lightbox",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("viewOriginal"),
        onClick: () => setPreview(null),
        onKeyDown: (event) => {
          if (event.key === "Escape") setPreview(null);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "flash-lightbox__close",
              onClick: () => setPreview(null),
              title: t("closePreview"),
              "aria-label": t("closePreview"),
              children: "\u2715"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              className: "flash-lightbox__img",
              src: preview,
              alt: "",
              draggable: false,
              onClick: (event) => event.stopPropagation()
            }
          )
        ]
      }
    )
  ] });
}
function apply(ctx) {
  const style = document.createElement("style");
  style.dataset.plugin = PACKAGE_ID;
  style.textContent = skin_default;
  document.head.append(style);
  ctx.effect(() => () => style.remove(), "flash-skin: scoped styles");
  const theme = ctx.get("theme");
  const scope = createPreferenceStore(restoreInitialSet());
  ctx.effect(() => () => scope.dispose(), "flash-skin: appearance preference");
  const weights = createWeightsStore();
  ctx.effect(() => () => weights.dispose(), "flash-skin: composite weights");
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "flash-skin: backdrop presenter");
  const openDetails = () => {
    try {
      const navigation = ctx.reflect.get?.("pluginNavigation");
      const open = navigation?.openBundle;
      if (typeof open === "function") open(PACKAGE_ID);
    } catch {
    }
  };
  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
      zh: {
        ...CONFIG_TEXTS.zh,
        "appearance": "\u4EBA\u7269\u8096\u50CF",
        "portraitSet": "\u4EBA\u7269\u8096\u50CF\u7EC4",
        "portraitSwitch": "\u4EBA\u7269\u5F3A\u5EA6",
        "driver.title": "\u5F3A\u5EA6\u9A71\u52A8",
        "driver.manual": "\u624B\u52A8",
        "driver.effort": "\u8DDF\u968F\u63A8\u7406",
        "driver.composite": "\u7EFC\u5408\u52A0\u6743",
        "weights.title": "\u7EFC\u5408\u52A0\u6743\uFF08\u624B\u52A8\u53EF\u8C03\uFF09",
        "weights.hint": "\u6309\u6743\u91CD\u5408\u6210\u7684 0\u20136 \u5F3A\u5EA6\u5B9E\u65F6\u9A71\u52A8\u4EBA\u7269\u8096\u50CF\uFF1B\u5168\u4E3A 0 \u65F6\u56DE\u9000\u9ED8\u8BA4\u6743\u91CD\u3002",
        "weights.usage": "\u7528\u91CF",
        "weights.pressure": "\u538B\u529B",
        "weights.effort": "\u63A8\u7406",
        "weights.speed": "\u901F\u5EA6",
        "weights.usageShort": "\u7528\u91CF",
        "weights.pressureShort": "\u538B\u529B",
        "weights.effortShort": "\u63A8\u7406",
        "weights.speedShort": "\u901F\u5EA6",
        "weights.usageDesc": "\u672C\u6B21\u5DF2\u751F\u6210 token,\u9971\u548C 30 \u4E07",
        "weights.pressureDesc": "\u4E0A\u4E0B\u6587\u5360\u7528/\u7A97\u53E3,\u65E0\u7A97\u53E3\u6309\u8F6E\u6B21",
        "weights.effortDesc": "\u5F53\u524D\u63A8\u7406\u6863\u4F4D,\u672A\u8BBE\u7F6E\u6309 0",
        "weights.speedDesc": "\u89E3\u7801\u901F\u5EA6,\u9971\u548C 80 t/s",
        "weights.reset": "\u6062\u590D\u9ED8\u8BA4",
        "weights.score": "\u5F97\u5206",
        "weights.frame": "\u5E27",
        "weights.speedTiming": "\u901F\u5EA6\u8870\u51CF\u8BA1\u65F6\uFF08\u6BEB\u79D2\uFF09",
        "weights.graceMs": "\u505C\u7559",
        "weights.fadeMs": "\u8870\u51CF"
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Portrait group",
        "portraitSet": "Portrait set",
        "portraitSwitch": "Person level",
        "driver.title": "Level driver",
        "driver.manual": "Man",
        "driver.effort": "Reason",
        "driver.composite": "Comp",
        "weights.title": "Composite weights (editable)",
        "weights.hint": "Live 0\u20136 portrait level synthesised from these weights; all-zero falls back to defaults.",
        "weights.usage": "Usage",
        "weights.pressure": "Pressure",
        "weights.effort": "Reasoning",
        "weights.speed": "Speed",
        "weights.usageShort": "Use",
        "weights.pressureShort": "Press",
        "weights.effortShort": "Reason",
        "weights.speedShort": "Spd",
        "weights.usageDesc": "Tokens generated this turn, saturates at 300k",
        "weights.pressureDesc": "Context used / window; falls back to turns",
        "weights.effortDesc": "Current reasoning level, unknown counts as 0",
        "weights.speedDesc": "Decode speed, saturates at 80 t/s",
        "weights.reset": "Restore defaults",
        "weights.score": "Score",
        "weights.frame": "Frame",
        "weights.speedTiming": "Speed decay timing (ms)",
        "weights.graceMs": "Hold",
        "weights.fadeMs": "Fade"
      }
    }),
    "flash-skin: settings locale"
  );
  const setLabel = ctx.locale.bind(LOCALE_NAMESPACE);
  const configForm = ctx.configForms.get(CONFIG_NAMESPACE);
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-portrait-set",
    // Rendered directly under the host「外观」appearance row (order 10) and
    // above「强度驱动」(driver at 10.6); higher order = lower on screen.
    order: 10.5,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope, presenter, form: configForm, locale: ctx.locale, t: setLabel })
  }, PortraitSetRow));
  const OPEN_DETAILS_SWITCH_ID = `${PACKAGE_ID}:open-details`;
  const PORTRAIT_SET_SWITCH_ID = `${PACKAGE_ID}:portrait-set`;
  const PORTRAIT_SLIDER_SWITCH_ID = `${PACKAGE_ID}:portrait-slider`;
  const DRIVER_SWITCH_ID = `${PACKAGE_ID}:driver`;
  let quickControl;
  let quickSwitchesRegistered = false;
  const portraitSetOptions = () => {
    let configured = [];
    try {
      const groupsSnapshot = configForm?.getSnapshot ? configForm.getSnapshot() : void 0;
      if (groupsSnapshot?.status === "ready") {
        const value = groupsSnapshot.value?.portraitGroups;
        configured = value ?? [];
      }
    } catch {
    }
    let active = "";
    try {
      const localeSnapshot = ctx.locale?.getSnapshot?.();
      active = localeSnapshot?.active ?? "";
    } catch {
    }
    const list = configured.length > 0 ? configured : [DEFAULT_PORTRAIT_SET];
    return list.map((set) => ({
      label: setDisplayName(set, active),
      value: normalizeSetId(set.id) ?? set.id
    }));
  };
  let refreshPortraitSlider;
  const buildPortraitSliderSwitch = () => {
    const count = presenter.getPortraitCount();
    const max2 = Math.max(0, count - 1);
    return {
      id: PORTRAIT_SLIDER_SWITCH_ID,
      label: () => setLabel("portraitSwitch"),
      icon: "sliders",
      type: "slider",
      group: "appearance",
      order: 26.5,
      min: 0,
      max: max2,
      step: 1,
      getValue: () => frameIndexForContinuousLevel(presenter.getLevel(), presenter.getPortraitCount()),
      setValue: (value) => {
        const c = presenter.getPortraitCount();
        if (c < 2) return;
        const index = Math.min(c - 1, Math.max(0, Math.round(Number(value) || 0)));
        const next = stagedFrames(c)[index] ?? 0;
        presenter.setLevel(next);
        try {
          localStorage.setItem(LEVEL_KEY, String(next));
        } catch {
        }
        quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      },
      // Right-hand value label shows the currently displayed frame (1-based
      // over the group's image count) so "every image is slide-reachable"
      // reads directly off the control.
      formatLabel: (value) => {
        const c = presenter.getPortraitCount();
        if (c < 2) return "";
        const index = Math.min(c - 1, Math.max(0, Math.round(Number(value) || 0)));
        return `${index + 1}/${c}`;
      },
      visible: () => presenter.isEnabled() && presenter.getPortraitCount() >= 2
    };
  };
  const registerQuickSwitches = (registry) => {
    if (quickSwitchesRegistered) return;
    const reg = registry;
    if (!reg || typeof reg.registerSwitch !== "function") return;
    quickSwitchesRegistered = true;
    quickControl = reg;
    let sliderCount = -1;
    let sliderDisposeFn;
    refreshPortraitSlider = () => {
      const count = presenter.getPortraitCount();
      if (count === sliderCount) return sliderDisposeFn;
      sliderCount = count;
      const dispose = quickControl?.registerSwitch?.(buildPortraitSliderSwitch());
      quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      sliderDisposeFn = typeof dispose === "function" ? dispose : void 0;
      return sliderDisposeFn;
    };
    let lastEnabled = presenter.isEnabled();
    let lastDriver = scope.getSnapshot().driver;
    const offScope = scope.subscribe(() => {
      refreshPortraitSlider?.();
      const enabled = presenter.isEnabled();
      if (enabled !== lastEnabled) {
        lastEnabled = enabled;
        quickControl?.notifyChange?.(OPEN_DETAILS_SWITCH_ID);
        quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID);
        quickControl?.notifyChange?.(PORTRAIT_SLIDER_SWITCH_ID);
      }
      const driver = scope.getSnapshot().driver;
      if (driver !== lastDriver) {
        lastDriver = driver;
        quickControl?.notifyChange?.(DRIVER_SWITCH_ID);
      }
    });
    ctx.effect(() => {
      const setDispose = reg.registerSwitch?.({
        id: PORTRAIT_SET_SWITCH_ID,
        label: () => setLabel("portraitSet"),
        icon: "palette",
        type: "select",
        group: "appearance",
        order: 26,
        options: () => portraitSetOptions(),
        getValue: () => presenter.getSet().id,
        setValue: (value) => {
          void presenter.choose(String(value)).catch(() => void 0).finally(() => quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID));
        },
        visible: () => presenter.isEnabled()
      });
      const driverDispose = reg.registerSwitch?.({
        id: DRIVER_SWITCH_ID,
        label: () => setLabel("driver.title"),
        icon: "signal",
        type: "buttongroup",
        group: "appearance",
        order: 26.25,
        options: () => [
          { value: "manual", label: setLabel("driver.manual") },
          { value: "effort", label: setLabel("driver.effort") },
          { value: "composite", label: setLabel("driver.composite") }
        ],
        getValue: () => scope.getSnapshot().driver,
        setValue: (value) => {
          const driver = value === "manual" || value === "effort" || value === "composite" ? value : "manual";
          void scope.setDriver(driver).catch(() => void 0).finally(() => quickControl?.notifyChange?.(DRIVER_SWITCH_ID));
        },
        visible: () => presenter.isEnabled()
      });
      const sliderDispose = refreshPortraitSlider?.();
      const openDispose = reg.registerSwitch?.({
        id: OPEN_DETAILS_SWITCH_ID,
        label: () => setLabel("openDetails"),
        icon: "doc",
        type: "action",
        // Built-in Appearance group (just past the person-switch row at 26.5),
        // via the `dsh-flash-skin:` entry in dsh-flash's `_COMPANIONS` whitelist.
        group: "appearance",
        order: 27,
        hideLabel: true,
        actionLabel: () => setLabel("openDetails"),
        visible: () => presenter.isEnabled(),
        run: () => openDetails()
      });
      return () => {
        if (typeof setDispose === "function") setDispose();
        else reg.unregisterSwitch?.(PORTRAIT_SET_SWITCH_ID);
        if (typeof driverDispose === "function") driverDispose();
        else reg.unregisterSwitch?.(DRIVER_SWITCH_ID);
        if (typeof sliderDispose === "function") sliderDispose();
        else reg.unregisterSwitch?.(PORTRAIT_SLIDER_SWITCH_ID);
        if (typeof openDispose === "function") openDispose();
        else reg.unregisterSwitch?.(OPEN_DETAILS_SWITCH_ID);
        offScope();
      };
    }, "flash-skin: quick switches");
  };
  const cts = ctx;
  if (typeof cts.on === "function") {
    try {
      const offReady = cts.on("dock-flash:ready", (payload) => {
        const p = payload;
        if (p?.quickControl) registerQuickSwitches(p.quickControl);
      });
      ctx.effect(() => () => {
        if (typeof offReady === "function") offReady();
      }, "flash-skin: dock-ready off");
    } catch {
    }
  }
  try {
    const registry = cts.get?.("quickControl");
    if (registry) registerQuickSwitches(registry);
  } catch {
  }
  ctx.effect(() => {
    if (!configForm || typeof configForm.subscribe !== "function") return void 0;
    const read = () => {
      const snapshot = configForm.getSnapshot?.();
      const value = snapshot?.value;
      presenter.setPortraitGroups(value?.portraitGroups ?? []);
      refreshPortraitSlider?.();
    };
    read();
    const unsubscribe = configForm.subscribe(read);
    return () => unsubscribe();
  }, "flash-skin: portrait-groups mirror");
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
    name: "plugins.bundle.config",
    key: PACKAGE_ID,
    order: 10,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ form: configForm, weights, t: setLabel })
  }, FlashSkinConfigCard));
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-driver",
    // Rendered directly under「人物肖像」(portrait set at 10.5), just past the
    // host「外观」cluster; higher order = lower on screen.
    order: 10.6,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope, t: setLabel })
  }, DriverRow));
  const readLevel = () => {
    try {
      return Number(localStorage.getItem(LEVEL_KEY) ?? "0") || 0;
    } catch {
      return 0;
    }
  };
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "flash-level-control",
    order: 10,
    // The host's `conversation.input.left` binding auto-injects `useProjection`
    // as a standard prop (see dsh-client-ui-conversation slot contract); we only
    // return our own session props here and let the renderer mix the projection
    // hook in.
    inject: (sessionId) => {
      const available = ctx.sessions.subagentAddress(sessionId) === void 0;
      const directory = ctx.modelDirectories.directoryFor(sessionId);
      return {
        directory: directory.store,
        presenter,
        scope,
        weights,
        settings: { level: readLevel() },
        locale: ctx.locale,
        t: setLabel,
        load: () => {
          if (available) void directory.load().catch(() => void 0);
        },
        select: (selection) => available ? directory.select(selection).then((result) => result.ok, () => false) : Promise.resolve(false)
      };
    }
  }, FlashLevelControl));
}
return module.exports;}});
//# sourceMappingURL=client.js.map
