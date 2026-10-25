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
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/skin.css
var skin_default = '.flash-skin-backdrop {\n  position: fixed;\n  z-index: -1;\n  inset: 0;\n  overflow: hidden;\n  pointer-events: none;\n  background: var(--flash-page, #f5f6f8);\n  opacity: 0;\n  transition: opacity 220ms ease;\n}\n\nbody[data-flash-skin="on"] .flash-skin-backdrop {\n  opacity: 1;\n}\n\n/* Portrait sequence layer: a person image that changes with the slider. */\n.flash-skin-backdrop .flash-skin-sequence-frame {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  display: block;\n  width: min(42vw, 720px);\n  height: 100%;\n  object-fit: cover;\n  object-position: 50% 42%;\n  opacity: var(--flash-portrait-opacity, 0.45);\n  transform: translateY(-50%);\n  filter: none;\n  mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 10%, black 30%, black 100%);\n  transition: filter 180ms linear;\n}\n\n.flash-skin-backdrop img {\n  display: none;\n}\n\n.flash-skin-backdrop[data-media="sequence"] .flash-skin-sequence-frame {\n  display: block;\n  opacity: var(--flash-portrait-opacity, 0.6);\n}\n\n.flash-skin-backdrop[data-media="color"] img {\n  display: none;\n}\n\n/* \u4E3B\u9898\u8272/\u6309\u94AE/accent/\u8FB9\u6846/\u6587\u5B57/layer \u7B49 token \u67D3\u8272 \u2014\u2014 \u5DF2\u6309\u8981\u6C42\u79FB\u9664\uFF0C\n * \u9875\u9762\u6062\u590D App \u539F\u751F\u4E3B\u9898\u6837\u5F0F\u3002\u4EC5\u4FDD\u7559\u201C\u80CC\u666F\u900F\u51FA\u201D\u6700\u5C0F\u5FC5\u8981\u89C4\u5219\uFF1A\n * .flash-skin-backdrop \u4EBA\u7269\u7167\u5C42\u662F z-index:-1 \u7684\u5E95\u5C42\u56FA\u5B9A\u5C42\uFF0C\n * \u5FC5\u987B\u8BA9 App \u57FA\u7840\u80CC\u666F\u900F\u660E\u624D\u80FD\u900F\u51FA\u6765\uFF08\u5426\u5219\u88AB\u539F\u751F\u4E0D\u900F\u660E\u80CC\u666F\u76D6\u4F4F\uFF09\u3002\n * body \u5E95\u8272\u4ECD\u7531 backdrop \u5C42\u81EA\u8EAB\u7684 --flash-page \u63D0\u4F9B\u3002 */\nbody[data-flash-skin="on"] {\n  --dsw-alias-bg-base: transparent !important;\n  background: var(--flash-page) !important;\n}\n\nbody[data-flash-skin="on"] > #root {\n  background: transparent !important;\n}\n\nbody[data-flash-skin="on"] button,\nbody[data-flash-skin="on"] input,\nbody[data-flash-skin="on"] textarea {\n  transition: color 160ms linear, background-color 160ms linear, border-color 160ms linear;\n}\n\n.flash-level-control {\n  --flash-control-accent: var(--flash-accent, #4176e6);\n  --flash-control-rail: var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\n  position: relative;\n  display: flex;\n  width: 124px;\n  height: 28px;\n  align-items: center;\n  margin: 0 3px;\n}\n\n.flash-level-control__range {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: 28px;\n  cursor: ew-resize;\n  appearance: none;\n  background: transparent;\n  touch-action: pan-y;\n}\n\n.flash-level-control__range::-webkit-slider-runnable-track {\n  height: 6px;\n  border-radius: 3px;\n  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\n}\n\n.flash-level-control__range::-webkit-slider-thumb {\n  width: 15px;\n  height: 15px;\n  margin-top: -4.5px;\n  border: 2px solid var(--flash-accent, #4176e6);\n  border-radius: 50%;\n  appearance: none;\n  background: #fff;\n  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);\n}\n\n.flash-level-control__range::-moz-range-track {\n  height: 6px;\n  border-radius: 3px;\n  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\n}\n\n.flash-level-control__range::-moz-range-thumb {\n  width: 11px;\n  height: 11px;\n  border: 2px solid var(--flash-accent, #4176e6);\n  border-radius: 50%;\n  background: #fff;\n}\n\n.flash-level-control__range:focus-visible {\n  outline: none;\n}\n\n.flash-level-control__ticks {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n\n.flash-level-control__tick {\n  position: absolute;\n  top: 11px;\n  width: 2px;\n  height: 6px;\n  border-radius: 1px;\n  background: var(--flash-control-rail, rgb(0 0 0 / 16%));\n}\n\n.flash-level-control__tooltip {\n  position: absolute;\n  bottom: 30px;\n  left: calc(var(--flash-slider-ratio, 0) * 100%);\n  transform: translateX(-50%);\n  padding: 3px 8px;\n  border-radius: 6px;\n  background: var(--flash-ink, #191b1e);\n  color: var(--flash-page, #f5f6f8);\n  font-size: 11px;\n  line-height: 1.4;\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: 3;\n}\n\n.flash-appearance-binding {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  width: 100%;\n  margin: 2px 0;\n}\n\n.flash-appearance-binding[data-plugin] {\n  min-width: 260px;\n}\n\n.flash-portrait-set[data-plugin] {\n  box-sizing: border-box;\n  display: grid;\n  gap: 8px;\n  width: 100%;\n  margin: 2px 0;\n}\n\n.flash-portrait-set__label {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 18px;\n}\n\n.flash-appearance-sets {\n  box-sizing: border-box;\n  display: grid;\n  gap: 12px;\n  width: 100%;\n  margin: 2px 0;\n}\n\n.flash-appearance-sets[data-plugin] {\n  grid-template-columns: 1fr;\n}\n\n/* \u6BCF\u7EC4\u4EBA\u7269\u8096\u50CF\u5360\u4E00\u6574\u884C\uFF1A\u5DE6\u4FA7\u4E3A\u8EAB\u4EFD\uFF08\u25C8 + \u7EC4\u540D\uFF09\uFF0C\u53F3\u4FA7\u80F6\u7247\u6761\u94FA\u6EE1\u5269\u4F59\u5BBD\u5EA6\uFF0C\n * \u9010\u5E27\u5C55\u793A\u8BE5\u7EC4\u7684\u5168\u90E8\u7D20\u6750\uFF1B\u7A84\u5C4F/\u957F\u5217\u8868\u65F6\u80F6\u7247\u6761\u6A2A\u5411\u6EDA\u52A8\u3002 */\n.flash-appearance-choice {\n  box-sizing: border-box;\n  border: 1px solid var(--dsw-alias-border-l2);\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 14px;\n  padding: 12px 14px;\n  border-radius: 14px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  background: transparent;\n  font-size: 14px;\n  line-height: 22px;\n  text-align: left;\n  display: flex;\n}\n\n.flash-appearance-choice:hover:not([aria-checked="true"]) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.flash-appearance-choice[aria-checked="true"],\n.flash-appearance-choice.flash-appearance-choice--on {\n  border-color: var(--dsw-static-neutral-bluish-400);\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.flash-appearance-choice__identity {\n  display: flex;\n  flex: 0 0 auto;\n  align-items: center;\n  gap: 8px;\n  min-width: 92px;\n  white-space: nowrap;\n}\n\n.flash-appearance-choice__filmstrip {\n  display: flex;\n  flex: 1 1 auto;\n  min-width: 0;\n  align-items: center;\n  gap: 6px;\n  overflow-x: auto;\n  padding: 2px 2px 6px;\n}\n\n.flash-appearance-choice__frame {\n  display: block;\n  flex: 0 0 auto;\n  width: 52px;\n  height: 52px;\n  border-radius: 6px;\n  object-fit: cover;\n  object-position: 50% 30%;\n}\n\n.flash-appearance-choice__icon {\n  display: block;\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  color: currentColor;\n  font-size: 16px;\n  line-height: 16px;\n}\n\n.flash-appearance-choice__label {\n  display: block;\n}\n\n.flash-appearance-choice:disabled {\n  cursor: progress;\n  opacity: 0.7;\n}\n\n@media (max-width: 760px) {\n  .flash-level-control {\n    width: 92px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .flash-skin-backdrop {\n    transition: none;\n  }\n}\n\n/* ---------------------------------------------------------------------------\n * \u81EA\u5B9A\u4E49\u914D\u7F6E\u9875\uFF1A\u8096\u50CF\u76AE\u80A4\u7EC4\u7BA1\u7406\u5668\uFF08plugins.bundle.config \u9875\u9762\u89C6\u56FE\uFF09\n * \u6CBF\u7528\u4E0A\u5C42 --dsw-* \u522B\u540D\u4E0E --flash-* \u53D8\u91CF\uFF0C\u9002\u914D\u660E\u6697\u4E24\u5957\u4E3B\u9898\u3002\n * ------------------------------------------------------------------------- */\n\n.flash-portrait-groups {\n  font-size: 14px;\n  line-height: 22px;\n  color: var(--dsw-alias-label-primary);\n}\n\n.flash-portrait-groups__head {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 8px 12px;\n}\n\n.flash-portrait-groups__title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 24px;\n}\n\n.flash-portrait-groups__hint,\n.flash-portrait-groups__notice {\n  margin: 6px 0 14px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.flash-portrait-groups__empty {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 16px;\n  border: 1px dashed var(--dsw-alias-border-l2);\n  border-radius: 12px;\n}\n\n.flash-portrait-group {\n  padding: 14px 0 16px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.flash-portrait-group:last-child {\n  border-bottom: none;\n}\n\n.flash-portrait-group__head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 10px;\n}\n\n/* \u8EAB\u4EFD\u884C\uFF1Aset id + \u4E2D\u82F1\u6587\u540D\u79F0\u4E09\u4E2A\u5185\u8054\u8F93\u5165\u5361\uFF0Cid \u8F93\u5165\u7A84\u4E00\u4E9B\u4EE5\u793A\u5176\u4E3A\u6301\u4E45\u5316\u6807\u8BC6\u3002\n   \u6BCF\u5F20\u8F93\u5165\u5361\u81EA\u5E26\u4E00\u4E2A\u53EF\u89C1\u7684\u6587\u5B57\u6807\u7B7E\uFF08caption\uFF09\uFF0C\u8BF4\u660E\u8BE5\u5B57\u6BB5\u662F\u4EC0\u4E48\u3002 */\n.flash-portrait-group__identity {\n  display: flex;\n  align-items: flex-end;\n  gap: 10px;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.flash-portrait-group__field {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex: 1 1 0;\n  min-width: 0;\n}\n\n.flash-portrait-group__field-caption {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));\n  text-transform: none;\n  user-select: none;\n}\n\n.flash-portrait-group__name--id {\n  font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;\n  font-size: 12px;\n}\n\n/* id \u5217\u7A0D\u7A84\uFF0C\u4FDD\u6301\u4E09\u4E2A\u8F93\u5165\u5361\u7684\u6A2A\u5411\u8FA8\u8BC6\u5EA6\uFF08\u6574\u5361\u5BBD\u5EA6\u7531 label \u63A7\u5236\uFF09\u3002 */\n.flash-portrait-group__field--id {\n  flex: 0 1 220px;\n}\n\n.flash-portrait-group__name--lang {\n  font-weight: 600;\n}\n\n.flash-portrait-group__name {\n  min-width: 0;\n  flex: 1 1 auto;\n  box-sizing: border-box;\n  padding: 4px 8px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  font: inherit;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n  background: transparent;\n}\n\n.flash-portrait-group__name:hover {\n  border-color: var(--dsw-alias-border-l2);\n}\n\n.flash-portrait-group__name:focus {\n  border-color: var(--dsw-static-neutral-bluish-400);\n  background: var(--dsw-alias-bg-module-platform);\n  outline: none;\n}\n\n.flash-portrait-group__divider-hint {\n  margin: 0 0 10px;\n}\n\n/* Light/dark divider that sits between the portrait thumbnails. The threshold\n   is moved step by step with the flanking arrow buttons, not by mouse drag. */\n.flash-portrait-group__divider {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  min-height: 128px;\n  user-select: none;\n  -webkit-user-select: none;\n}\n\n.flash-portrait-group__divider::before {\n  content: "";\n  position: absolute;\n  top: 4px;\n  bottom: 4px;\n  left: 50%;\n  width: 2px;\n  transform: translateX(-50%);\n  border-radius: 999px;\n  background: var(--dsw-alias-border-l2);\n}\n\n.flash-portrait-group__divider-arrow {\n  display: grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 999px;\n  font-size: 10px;\n  line-height: 1;\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.flash-portrait-group__divider-arrow:hover:not(:disabled) {\n  border-color: var(--dsw-static-neutral-bluish-400);\n  color: var(--dsw-static-neutral-bluish-400);\n}\n\n.flash-portrait-group__divider-arrow:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n.flash-portrait-group__divider-handle {\n  position: relative;\n  width: 22px;\n  height: 22px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.flash-portrait-group__divider-handle::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  width: 10px;\n  height: 12px;\n  background: linear-gradient(\n    to right,\n    currentColor 0 1.5px,\n    transparent 1.5px 3px,\n    currentColor 3px 4.5px,\n    transparent 4.5px 6px,\n    currentColor 6px 7.5px\n  );\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.flash-portrait-group__divider:hover::before {\n  background: var(--dsw-static-neutral-bluish-400);\n}\n\n.flash-portrait-group__actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.flash-portrait-group__actions button,\n.flash-portrait-group__image-actions button,\n.flash-portrait-groups__empty button,\n.flash-portrait-group__add button,\n.flash-portrait-groups__foot button {\n  padding: 3px 10px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  font: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-primary);\n  background: transparent;\n  cursor: pointer;\n}\n\n.flash-portrait-group__actions button:hover:not(:disabled),\n.flash-portrait-group__image-actions button:hover:not(:disabled),\n.flash-portrait-groups__empty button:hover:not(:disabled),\n.flash-portrait-group__add button:hover:not(:disabled),\n.flash-portrait-groups__foot button:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.flash-portrait-group__actions button:disabled,\n.flash-portrait-group__image-actions button:disabled,\n.flash-portrait-group__add button:disabled,\n.flash-portrait-groups__foot button:disabled {\n  cursor: not-allowed;\n  opacity: 0.45;\n}\n\n.flash-portrait-group__danger {\n  border-color: color-mix(in srgb, var(--dsw-static-severity-error-default, #d54343) 55%, transparent) !important;\n  color: var(--dsw-static-severity-error-default, #d54343) !important;\n}\n\n.flash-portrait-group__images {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));\n  gap: 10px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.flash-portrait-group__image {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  min-height: 128px;\n}\n\n.flash-portrait-group__image img {\n  display: block;\n  width: 100%;\n  aspect-ratio: 1 / 1;\n  object-fit: cover;\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-module-platform);\n  transition: opacity 160ms linear;\n}\n\n.flash-portrait-group__image-index {\n  position: absolute;\n  top: 6px;\n  left: 6px;\n  min-width: 18px;\n  padding: 0 5px;\n  border-radius: 999px;\n  font-size: 11px;\n  line-height: 18px;\n  text-align: center;\n  color: #fff;\n  background: rgb(0 0 0 / 55%);\n}\n\n.flash-portrait-group__image-actions {\n  position: absolute;\n  right: 6px;\n  bottom: 6px;\n  left: 6px;\n  display: none;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 4px;\n}\n\n.flash-portrait-group__image:hover .flash-portrait-group__image-actions {\n  display: flex;\n}\n\n.flash-portrait-group__image-actions button {\n  padding: 2px 7px;\n  font-size: 11px;\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.flash-portrait-group__url {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 5px 8px;\n  border: 1px solid var(--dsw-static-neutral-bluish-400);\n  border-radius: 8px;\n  font: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-module-platform);\n}\n\n.flash-portrait-group__url:focus {\n  outline: none;\n}\n\n.flash-portrait-group__add button {\n  align-self: stretch;\n  min-height: 128px;\n  border-style: dashed;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.flash-portrait-group__add button.flash-portrait-group__add-pick {\n  align-self: auto;\n  min-height: 0;\n  border-style: solid;\n  color: var(--dsw-alias-label-primary);\n}\n\n.flash-portrait-group__add button:hover:not(:disabled) {\n  border-style: dashed;\n  color: var(--dsw-alias-label-primary);\n}\n\n.flash-portrait-group__add button.flash-portrait-group__add-pick:hover:not(:disabled) {\n  border-style: solid;\n}\n\n.flash-portrait-groups__notice--error {\n  color: var(--dsw-static-severity-error-default, #d54343);\n}\n\n.flash-portrait-groups__foot {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 14px;\n}\n\n.flash-portrait-groups__foot button {\n  padding: 5px 12px;\n}\n\n/* =========================================================================\n * \u5C45\u5DE6\u5E03\u5C40\u8986\u76D6 \u2014\u2014 \u53EF\u8C03\u5BBD\u5EA6\u5BF9\u8BDD\u5185\u5BB9\u533A\uFF08\u76EE\u6807\u5BBF\u4E3B 0.2.1-rc.2\uFF09\n *\n * \u9700\u8986\u76D6\u7684\u539F\u751F\u89C4\u5219\uFF08dsh-client-ui-chat / -conversation \u7F16\u8BD1\u4EA7\u7269\uFF09\uFF1A\n *   .EvIC1a_column{max-width:var(--dsh-chat-content-width);width:100%;margin:0 auto}\n *   .wSkVaW_widthHandle{width:min(10px,calc((100% - var(--dsh-chat-content-width)) / 2 - 24px - 24px));...}\n *   .wSkVaW_widthHandle[data-side=left ]{right:calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\n *   .wSkVaW_widthHandle[data-side=right]{left :calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\n *\n * \u76EE\u6807\uFF1A\u5185\u5BB9\u5217\u7531\u201C\u4EE5\u89C6\u53E3\u4E2D\u70B9\u4E3A\u5BF9\u79F0\u8F74\u5C45\u4E2D\u201D\u6539\u4E3A\u201C\u9760\u5DE6\u5BF9\u9F50\u201D\uFF0C\u5E76\u5728\u5DE6\u4FA7\u9884\u7559\u4E00\u6BB5\n *       timeline \u69FD\u5BBD\uFF08\u9ED8\u8BA4 50px\uFF0C\u53EF\u8986\u76D6\u6539\uFF09\u3002\u53EA\u4FDD\u7559\u53F3\u4FA7\u62D6\u628A\uFF0C\u5E76\u628A\u53F3\u62D6\u628A\u91CD\u65B0\n *       \u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\u7EAF CSS\uFF0C\u53F3\u62D6\u628A\u6CBF\u7528\u539F\u751F \xD72 \u62D6\u62FD\u624B\u611F\u3002\n * ========================================================================= */\nbody[data-flash-skin="on"] {\n  /* \u5DE6\u4FA7\u4E3A timeline \u9884\u7559\u7684\u69FD\u5BBD\uFF08px\uFF09\u3002\u9700\u8981\u66F4\u5927/\u66F4\u5C0F\u65F6\u76F4\u63A5\u6539\u8FD9\u91CC\u3002 */\n  --dsh-flash-timeline-gutter: 40px;\n  /* \u53F3\u62D6\u628A\u4E0E\u5185\u5BB9\u5217\u53F3\u7F18\u7684\u95F4\u9699\uFF08\u7EE7\u627F\u539F\u751F 24px \u624B\u611F\uFF09\u3002 */\n  --dsh-flash-handle-gap: 24px;\n  /* \u5BF9\u9F50\u57FA\u51C6\u8F74 = \u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D\u3002\u69FD\u5BBD(50) + \u5185\u5BB9\u5217\u7236\u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u8FB9\u8DDD(\u4FA7\u4F59\u91CF16 + 16)\uFF0C\n   * \u4F7F\u5185\u5BB9\u5217\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u3002\u6B8B\u4F59\u7ED3\u6784\u5DEE\u7528 nudge \u5FAE\u8C03\uFF08\u9ED8\u8BA4 0\uFF0C\u6B63\u53F3\u79FB\uFF09\u3002 */\n  --dsh-flash-content-left: calc(\n    var(--dsh-flash-timeline-gutter, 50px)\n    + var(--dsh-composer-side-clearance, 16px) + 16px\n  );\n  --dsh-flash-align-nudge: 0px;\n}\n\n/* 0) \u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u201C\u5B8C\u5168\u4E00\u6837\u5BBD\u201D\u3002\n *    \u539F\u751F .wSkVaW_body \u628A --dsh-composer-card-max-width \u8BBE\u4E3A\n *    calc(var(--dsh-chat-content-width) + 32px)\uFF0C\u8F93\u5165\u5361\u6BD4\u5185\u5BB9\u5217\u5BBD 32px\u3002\n *    \u6B64\u5904\u76F4\u63A5\u5728 .wSkVaW_body \u7EA7\u8986\u5199\u4E3A = \u5185\u5BB9\u5217\u5BBD\uFF0C\u8BA9\u8F93\u5165\u5361(+todo+\u6392\u961F\u6761)\n *    \u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u3001\u540C\u5DE6\u7F18\uFF0C\u53F3\u7F18\u4E5F\u9010\u70B9\u5BF9\u9F50\u3002 */\nbody[data-flash-skin="on"] .wSkVaW_body {\n  --dsh-composer-card-max-width: var(--dsh-chat-content-width);\n}\n\n/* 1) \u5185\u5BB9\u5217\u6539\u4E3A\u8D34\u5DE6\uFF1A\u5DE6\u7F18\u5BF9\u9F50\u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D(= content-left\uFF0Cnudge \u53EF\u5FAE\u8C03)\uFF0C\n *    \u53F3\u8FB9\u8DDD auto\uFF08\u4E0D\u518D\u5BF9\u534A\u5C45\u4E2D\uFF09\u3002\n *    \u6CE8\uFF1A.EvIC1a_scroll \u81EA\u5E26 padding:16px calc(\u4FA7\u4F59\u91CF+16)\uFF0C\u6545\u8FD9\u91CC\u53BB\u6389\u7236 padding\uFF0C\n *    \u8BA9\u5185\u5BB9\u5217\u51C0\u5DE6\u7F18 = content-left\uFF0C\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u540C\u57FA\u51C6\u3002 */\nbody[data-flash-skin="on"] .EvIC1a_column {\n  margin-right: auto !important;\n  margin-left: calc(\n    var(--dsh-flash-timeline-gutter, 50px)\n    + var(--dsh-flash-align-nudge, 0px)\n  ) !important;\n}\n\n/* 2) \u9690\u85CF\u5DE6\u4FA7\u62D6\u628A\uFF0C\u53EA\u4FDD\u7559\u53F3\u4FA7\u3002 */\nbody[data-flash-skin="on"] .wSkVaW_widthHandle[data-side="left"] {\n  display: none !important;\n}\n\n/* 3) \u53F3\u4FA7\u62D6\u628A\u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\n *    \u5217\u53F3\u7F18\u76F8\u5BF9\uFF08\u5168\u5BBD\u7684\uFF09\u5B9A\u4F4D\u7956\u5148\u7684\u6C34\u5E73\u4F4D\u79FB =\n *       \u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u5BB9\u5185\u8FB9\u8DDD(var(--dsh-composer-side-clearance) + 16px)\n *     + timeline \u69FD 50px\n *     + \u5217\u5BBD var(--dsh-chat-content-width)\n *     + \u62D6\u628A\u95F4\u9699 24px\n *    \u62D6\u628A\u81EA\u8EAB\u5BBD\u5EA6\u56FA\u5B9A\u4E3A 10px\uFF08\u539F\u751F min(10px,\u2026) \u662F\u4E13\u4E3A\u5C45\u4E2D\u5E03\u5C40\u5199\u7684\uFF09\u3002\n */\nbody[data-flash-skin="on"] .wSkVaW_widthHandle[data-side="right"] {\n  left: calc(\n    var(--dsh-composer-side-clearance, 16px) + 16px\n    + var(--dsh-flash-timeline-gutter, 50px)\n    + var(--dsh-chat-content-width)\n    + var(--dsh-flash-handle-gap, 24px)\n  ) !important;\n  width: 10px !important;\n}\n\n/* 4) \u8F93\u5165\u5361\u7247\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\uFF08\u540C\u6837\u9884\u7559\u5DE6\u4FA7 timeline \u69FD\uFF09\u3002\n *    \u539F\u751F\u5C45\u4E2D\u6765\u81EA\u4E24\u5C42\uFF1A\n *       .uV2eYG_root{...;align-items:center}             -> \u8BA9 .uV2eYG_card \u6C34\u5E73\u5C45\u4E2D\n *       .wSkVaW_composerHero{...;align-self:center}     -> \u8BA9 hero \u8F93\u5165\u8868\u6574\u4F53\u5C45\u4E2D\n *    \u8F93\u5165\u5361\u5BBD\u5DF2\u7531\u7B2C 0 \u6BB5\u8986\u76D6\u4E3A\u201C\u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u201D(--dsh-composer-card-max-width\n *    = --dsh-chat-content-width)\uFF0C\u6545\u53EA\u9700\u5BF9\u9F50\u5DE6\u7F18\uFF1A\n *       \u5185\u5BB9\u5217\u5DE6\u7F18 = \u6EDA\u52A8\u533A\u5DE6 padding(= \u4FA7\u4F59\u91CF+16px) + \u69FD\u5BBD\n *       \u5361\u7247\u5DE6\u7F18   = \u8F93\u5165\u6839\u5DE6 padding(= \u4FA7\u4F59\u91CF) + \u5361\u7247 margin\n *       => margin = \uFF08\u4FA7\u4F59\u91CF+16px + \u69FD\u5BBD\uFF09- \u4FA7\u4F59\u91CF = 16px + \u69FD\u5BBD\n *    \u4E0E\u76AE\u80A4\u53D8\u91CF/\u4E3B\u9898\u8026\u5408\u4F4E\uFF0C\u6539\u69FD\u5BBD\u65F6\u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u540C\u6B65\u79FB\u52A8\u3002\u540C\u5BBD + \u540C\u5DE6\u7F18\n *    => \u8F93\u5165\u5361\u53F3\u7F18 = \u5185\u5BB9\u5217\u53F3\u7F18\uFF0C\u6EDA\u52A8\u5230\u6700\u4E0B\u6309\u94AE(\u7B2C 7 \u6BB5)\u5373\u9489\u5728\u5176\u4E0A\u65B9\u3002\n */\nbody[data-flash-skin="on"] .uV2eYG_root {\n  align-items: flex-start !important;\n}\nbody[data-flash-skin="on"] .uV2eYG_root > .uV2eYG_card {\n  margin-left: calc(16px + var(--dsh-flash-timeline-gutter, 50px)) !important;\n}\nbody[data-flash-skin="on"] .wSkVaW_composerHero {\n  align-self: flex-start !important;\n}\n\n/* 5) todo \u4EFB\u52A1\u680F\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\u3002\n *    TodoPanel \u6302\u8F7D\u5728 conversation.input.dock\uFF0C\u4E0E\u8F93\u5165\u5361\u540C\u5904\n *    .wSkVaW_composerStack\uFF1B\u539F\u751F .lXshSW_root{margin:0 auto} \u5C45\u4E2D\u3002\n *    \u8F93\u5165\u5361\u5DE6\u7F18\u76F8\u5BF9 stack \u539F\u70B9\u7684\u4F4D\u79FB = \u6839 padding \u5DE6(\u4FA7\u4F59\u91CF) + \u5361 margin(16+\u69FD)\n *      = \u4FA7\u4F59\u91CF + 16 + \u69FD\u3002\u8FD9\u91CC TodoPanel \u4E0E\u8F93\u5165\u5361\u540C\u539F\u70B9\uFF0C\n *    \u6545\u628A margin:0 auto \u6539\u4E3A margin-left = \u540C\u503C\u3001margin-right \u4FDD\u6301 auto\uFF0C\n *    \u8BA9 todo \u6761\u5E26\u7684\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\n */\nbody[data-flash-skin="on"] .lXshSW_root {\n  margin-left: calc(\n    var(--dsh-composer-side-clearance, 16px) + 16px\n    + var(--dsh-flash-timeline-gutter, 50px)\n  ) !important;\n  margin-right: auto !important;\n}\n\n/* 6) \u6392\u961F\u6D88\u606F\u6761\uFF08QueueDock\uFF0Cconversation.input.dock\uFF09\u4E0E\u8F93\u5165\u5361\u4E00\u8D77\u5C45\u5DE6\u3002\n *    QueueDock \u6302\u5728 conversation.input.dock\uFF0C\u4E0E TodoPanel(.lXshSW_root)\n *    \u540C\u5904 .wSkVaW_composerStack\uFF0C\u539F\u751F ._7yHdaG_dock{margin:0 auto} \u5C45\u4E2D\u3002\n *    \u4E0E todo \u7528\u540C\u4E00\u4E2A margin-left \u4F4D\u79FB\uFF0C\u8BA9\u6392\u961F\u6761\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361/\u5185\u5BB9\u5217\u5DE6\u7F18\u5BF9\u9F50\u3002\n */\nbody[data-flash-skin="on"] ._7yHdaG_dock {\n  margin-left: calc(\n    var(--dsh-composer-side-clearance, 16px) + 16px\n    + var(--dsh-flash-timeline-gutter, 50px)\n  ) !important;\n  margin-right: auto !important;\n}\n\n/* 7) \u201C\u6EDA\u52A8\u5230\u6700\u4E0B\u201D\u6309\u94AE\u4E0E\u5DE6\u79FB\u540E\u7684\u5185\u5BB9\u5217\u53F3\u7F18\u5BF9\u9F50\u3002\n *    \u539F\u751F .EvIC1a_toBottomSlot \u94FA\u6EE1\u6574\u5BBD(left:0 right:0)\uFF0C\u7528\n *    justify-content:flex-end + padding-right \u628A\u6309\u94AE\u9489\u5728\u201C\u5C45\u4E2D\u5BF9\u9F50\u65F6\u201D\n *    \u5185\u5BB9\u5217\u7684\u53F3\u7F18\u3002\u5185\u5BB9\u5217\u5DE6\u79FB\u69FD\u5BBD\u540E\uFF0C\u53F3\u7F18\u4E5F\u8DDF\u7740\u5DE6\u79FB\uFF0C\u6545\u628A padding-right\n *    \u6539\u4E3A\u201C\u53F3\u4FA7\u5B9E\u9645\u7A7A\u4F59\u201D= 100% \u2212 \u69FD\u5BBD \u2212 (\u4FA7\u4F59\u91CF+16) \u2212 \u5217\u5BBD\u3002\n */\nbody[data-flash-skin="on"] .EvIC1a_toBottomSlot {\n  padding-right: calc(\n    100% - var(--dsh-flash-timeline-gutter, 50px)\n    - var(--dsh-composer-side-clearance, 16px) - 16px\n    - var(--dsh-chat-content-width)\n  ) !important;\n}\n\n';

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
var PORTRAIT_MAX_LEVEL = 30;
function clampLevel(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_LEVEL, Math.max(0, Math.round(value)));
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
    portraitLevel: Math.round(portraitScale * PORTRAIT_MAX_LEVEL),
    portraitOpacity: String(0.4 + portraitScale * 0.42)
  };
}

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PACKAGE_ID = "dsh-flash-skin";
var LOCALE_NAMESPACE = "flash.skin";
var CONFIG_NAMESPACE = "flash-skin";
var LEVEL_KEY = "dsh-flash-skin.level";
var SET_KEY = "dsh-flash-skin.set";
var BIND_EFFORT_KEY = "dsh-flash-skin.bind-effort";
var ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets`;
var PORTRAIT_ANCHORS = {
  liangsheng: [
    { level: 0, file: "stage-00.webp" },
    { level: 4, file: "level-04.webp" },
    { level: 9, file: "level-09.webp" },
    { level: 13, file: "level-13.webp" },
    { level: 17, file: "level-16.webp" },
    { level: 21, file: "level-19.webp" },
    { level: 26, file: "stage-24.webp" },
    { level: 30, file: "level-28.webp" }
  ],
  liangshen: [
    { level: 0, file: "level-01.webp" },
    { level: 4, file: "stage-06.webp" },
    { level: 9, file: "level-10.webp" },
    { level: 13, file: "level-14.webp" },
    { level: 17, file: "level-17.webp" },
    { level: 21, file: "level-21.webp" },
    { level: 26, file: "level-25.webp" },
    { level: 30, file: "level-29.webp" }
  ],
  liangzu: [
    { level: 0, file: "level-03.webp" },
    { level: 4, file: "level-07.webp" },
    { level: 9, file: "stage-12.webp" },
    { level: 13, file: "bridge-15.webp" },
    { level: 17, file: "stage-18.webp" },
    { level: 21, file: "level-22.webp" },
    { level: 26, file: "bridge-27.webp" },
    { level: 30, file: "stage-30.webp" }
  ]
};
var LEGACY_SET_IDS = {
  storm: "liangsheng",
  blaze: "liangshen",
  frost: "liangzu"
};
function normalizeSetId(id) {
  if (!id) return void 0;
  const mapped = LEGACY_SET_IDS[id];
  return mapped !== void 0 ? mapped : id;
}
function defaultSetIdentity(id) {
  if (!id) return void 0;
  return DEFAULT_PORTRAIT_SETS.find((item) => item.id === id);
}
function setDisplayName(set, active) {
  const def = defaultSetIdentity(set.id);
  const english = active.slice(0, 2).toLowerCase() === "en";
  const zh = (set.zh ?? def?.zh ?? "").trim();
  const en = (set.en ?? def?.en ?? "").trim();
  if (english) return en || zh || set.name || "";
  return zh || en || set.name || "";
}
function setFrames(set) {
  const configuredImages = set.images;
  if (Array.isArray(configuredImages) && configuredImages.length > 0) {
    return configuredImages.slice();
  }
  const anchors = PORTRAIT_ANCHORS[set.id] ?? [];
  const folder = set.folder;
  if (!folder || anchors.length === 0) return [];
  return anchors.slice(0, -1).map(({ file }) => `${ASSET_PREFIX}/${folder}/${file}`);
}
var DEFAULT_PORTRAIT_SETS = [
  { id: "liangsheng", folder: "portrait-source-v2", zh: "\u6881\u5723", en: "Liang the Saint" },
  { id: "liangshen", folder: "portrait-source-v3", zh: "\u6881\u795E", en: "Liang the God" },
  { id: "liangzu", folder: "portrait-source-v4", zh: "\u6881\u7956", en: "Liang the Ancestor" }
];
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
  set = DEFAULT_PORTRAIT_SETS[0];
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
      const count = group.images.length;
      return group.images.map((url, index) => ({
        level: count <= 1 ? 0 : Math.round(index / (count - 1) * PORTRAIT_MAX_LEVEL),
        url
      }));
    }
    const anchors = PORTRAIT_ANCHORS[set.id] ?? [];
    if (!set.folder || anchors.length === 0) return [];
    return anchors.slice(0, -1).map(({ level, file }) => ({
      level,
      url: `${ASSET_PREFIX}/${set.folder}/${file}`
    }));
  }
  // Resolve a persisted/selected set id to a PortraitSet. Configured (custom)
  // ids must survive anyway: they have no built-in anchors, so they resolve to
  // `{ id }` with no folder and rely on the configured group images.
  resolveSet(setId) {
    const found = DEFAULT_PORTRAIT_SETS.find((item) => item.id === setId);
    if (found) return { id: found.id, folder: found.folder };
    return { id: setId || DEFAULT_PORTRAIT_SETS[0].id };
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
    this.level = clampLevel(level);
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
    const scale = clampLevel(this.level) / MAX_LEVEL;
    this.portraits.select(Math.round(scale * PORTRAIT_MAX_LEVEL));
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
function FlashLevelControl({ directory, load, select, presenter, scope, settings }) {
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
  const bindEffort = skin.bindEffort;
  const [level, setLevel] = (0, import_react.useState)(() => bindEffort ? committedLevel : clampLevel(settings.level));
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
    if (!bindEffort || dragging.current || pending) return;
    setLevel(committedLevel);
    presenter.setLevel(committedLevel);
  }, [bindEffort, committedLevel, pending, presenter]);
  (0, import_react.useEffect)(() => {
    if (enabled) presenter.setLevel(level);
    try {
      localStorage.setItem(LEVEL_KEY, String(level));
    } catch {
    }
  }, [level, enabled, presenter]);
  if (!enabled) return null;
  if (bindEffort && (reasoning === null || efforts.length < 2)) return null;
  const previewIndex = bindEffort ? nearestEffortIndex(level, efforts) : -1;
  const previewEffort = efforts[previewIndex];
  const progressRatio = level / MAX_LEVEL;
  const tooltipLabel = previewEffort?.name;
  const commit = async (rawLevel) => {
    if (!bindEffort) {
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
      title: bindEffort ? previewEffort?.name : void 0,
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
            "aria-label": bindEffort ? "\u63A8\u7406\u5F3A\u5EA6" : "\u76AE\u80A4\u5F3A\u5EA6",
            "aria-valuetext": bindEffort ? previewEffort?.name ?? "" : tooltipLabel ?? "",
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
function EffortBindingRow({ scope, t }) {
  const snapshot = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  const [pending, setPending] = (0, import_react.useState)(false);
  if (!snapshot.enabled) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-appearance-binding", "data-plugin": PACKAGE_ID, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("effort.binding") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dsh_client_ui_primitives.Switch,
      {
        checked: snapshot.bindEffort,
        disabled: pending,
        label: t("effort.binding"),
        onChange: (next) => {
          if (pending) return;
          setPending(true);
          void scope.setBindEffort(next).catch(() => void 0).finally(() => setPending(false));
        }
      }
    )
  ] });
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
  const sets = (configured.length > 0 ? configured : DEFAULT_PORTRAIT_SETS).map((set) => ({
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
  return DEFAULT_PORTRAIT_SETS[0].id;
}
function createPreferenceStore(initialSet) {
  let snapshot = {
    enabled: true,
    set: initialSet ? initialSet : DEFAULT_PORTRAIT_SETS[0].id,
    bindEffort: localStorage.getItem(BIND_EFFORT_KEY) !== "0"
  };
  const listeners = /* @__PURE__ */ new Set();
  const onStorage = (event) => {
    if (event.key !== SET_KEY && event.key !== BIND_EFFORT_KEY) return;
    const nextSetId = event.key === SET_KEY ? normalizeSetId(event.newValue) : void 0;
    const next = {
      enabled: snapshot.enabled,
      set: event.key === SET_KEY ? nextSetId ?? snapshot.set : snapshot.set,
      bindEffort: event.key === BIND_EFFORT_KEY ? event.newValue !== "0" : snapshot.bindEffort
    };
    if (next.enabled === snapshot.enabled && next.set === snapshot.set && next.bindEffort === snapshot.bindEffort) return;
    snapshot = next;
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async set(enabled) {
      if (enabled === snapshot.enabled) return;
      snapshot = { ...snapshot, enabled };
      for (const listener of listeners) listener();
    },
    async setSet(setId) {
      if (!setId || setId === snapshot.set) return;
      try {
        localStorage.setItem(SET_KEY, setId);
      } catch {
      }
      snapshot = { ...snapshot, set: setId };
      for (const listener of listeners) listener();
    },
    async setBindEffort(bindEffort) {
      if (bindEffort === snapshot.bindEffort) return;
      try {
        localStorage.setItem(BIND_EFFORT_KEY, bindEffort ? "1" : "0");
      } catch {
      }
      snapshot = { ...snapshot, bindEffort };
      for (const listener of listeners) listener();
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
    "empty": "\u8FD8\u6CA1\u6709\u4EFB\u4F55\u8096\u50CF\u76AE\u80A4\u7EC4\uFF0C\u53EF\u4EE5\u5148\u7528\u5185\u7F6E\u7D20\u6750\u521D\u59CB\u5316\uFF0C\u518D\u4ECE\u96F6\u521B\u5EFA\u3002",
    "loadDefaults": "\u4F7F\u7528\u5185\u7F6E\u7D20\u6750\u521D\u59CB\u5316",
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
    "addImage": "\u6DFB\u52A0\u56FE\u7247",
    "pickLocalImage": "\u672C\u5730\u9009\u56FE",
    "pickLocalImageHint": "\u4ECE\u672C\u673A\u9009\u62E9\u4E00\u5F20\u56FE\u7247\uFF0C\u81EA\u52A8\u8F6C\u4E3A\u5185\u5D4C base64 \u586B\u5165\u3002",
    "imageUrlPlaceholder": "\u56FE\u7247 URL\uFF08http/https \u6216 /plugins/dsh-flash-skin/assets/\u2026\uFF09",
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
    "identityHint": "\u6807\u8BC6\uFF08Set ID\uFF09\u5199\u5165 localStorage \u6301\u4E45\u5316\u5F53\u524D\u9009\u62E9\uFF1A\u6539\u540D\u540E\u9700\u91CD\u65B0\u70B9\u51FB\u9009\u4E2D\u8BE5\u7EC4\u624D\u751F\u6548\uFF1B\u8BBE\u7F6E\u884C\u540D\u79F0\u6309\u754C\u9762\u8BED\u8A00\u663E\u793A\uFF08\u4E2D\u6587\u754C\u9762\u4E2D\u6587\u540D\uFF0C\u82F1\u6587\u754C\u9762\u82F1\u6587\u540D\uFF09\u3002\u5185\u7F6E\u7EC4\u7684\u9ED8\u8BA4\u4E2D/\u82F1\u6587\u540D\u4F1A\u5728\u672A\u4FEE\u6539\u65F6\u4E00\u76F4\u4F5C\u4E3A\u7F3A\u7701\u663E\u793A\u3002"
  },
  en: {
    "loading": "Loading\u2026",
    "title": "Portrait groups",
    "hint": "Each group is an ordered set of images; slots run from low to high reasoning level left to right. Empty slots fall back to the default art.",
    "readOnly": "The current document does not accept writes; connect or grant permission first.",
    "openDetails": "Flash Skin plugin settings",
    "openDetailsHint": "Open this plugin's (dsh-flash-skin) detail page in the plugin manager.",
    "empty": "No portrait groups yet \u2014 initialize from the built-in art, or create one from scratch.",
    "loadDefaults": "Initialize from built-in art",
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
    "addImage": "Add image",
    "pickLocalImage": "Pick local image",
    "pickLocalImageHint": "Choose an image from this device; it is embedded as base64 automatically.",
    "imageUrlPlaceholder": "Image URL (http/https or /plugins/dsh-flash-skin/assets/\u2026)",
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
    "identityHint": "The Set ID is persisted in localStorage for the current selection \u2014 after renaming, click the group again to take effect. The settings row shows the Chinese name in the Chinese UI and the English name in the English UI. Built-in sets keep their default Chinese/English names as fallbacks until overridden."
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
function boundaryForDarkLevel(count, level) {
  if (count <= 0) return 0;
  return Math.min(count, Math.max(0, Math.round(level / MAX_LEVEL * count)));
}
function FlashSkinConfigCard({ form, t: localeT }) {
  const snapshot = (0, import_react.useSyncExternalStore)(
    (listener) => form.subscribe(listener),
    () => form.getSnapshot()
  );
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [editing, setEditing] = (0, import_react.useState)(null);
  const fileInputRef = (0, import_react.useRef)(null);
  const pendingPick = (0, import_react.useRef)(null);
  const [fileError, setFileError] = (0, import_react.useState)(null);
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
    const next = clampLevel(current + delta);
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
  const loadBuiltinGroups = () => {
    const next = DEFAULT_PORTRAIT_SETS.map((set) => ({
      id: set.id,
      name: set.zh,
      zh: set.zh,
      en: set.en,
      darkLevel: MAX_LEVEL - 1,
      images: (PORTRAIT_ANCHORS[set.id] ?? []).map((anchor) => `${ASSET_PREFIX}/${set.folder}/${anchor.file}`)
    }));
    void commit(next);
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
    fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: fileError }),
    groups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-groups__empty", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("empty") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: !writable || busy, onClick: loadBuiltinGroups, children: t("loadDefaults") })
    ] }),
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
                        onError: (event) => {
                          event.currentTarget.style.opacity = "0.25";
                        }
                      }
                    ),
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
      busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-groups__notice", role: "status", children: "\u2026" })
    ] })
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
        "effort.binding": "\u6ED1\u5757\u7ED1\u5B9A\u63A8\u7406\u5F3A\u5EA6"
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Portrait group",
        "portraitSet": "Portrait set",
        "effort.binding": "Bind slider to reasoning level"
      }
    }),
    "flash-skin: settings locale"
  );
  const setLabel = ctx.locale.bind(LOCALE_NAMESPACE);
  const configForm = ctx.configForms.get(CONFIG_NAMESPACE);
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-portrait-set",
    order: 20,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope, presenter, form: configForm, locale: ctx.locale, t: setLabel })
  }, PortraitSetRow));
  const OPEN_DETAILS_SWITCH_ID = `${PACKAGE_ID}:open-details`;
  const PORTRAIT_SET_SWITCH_ID = `${PACKAGE_ID}:portrait-set`;
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
    const list = configured.length > 0 ? configured : DEFAULT_PORTRAIT_SETS;
    return list.map((set) => ({
      label: setDisplayName(set, active),
      value: normalizeSetId(set.id) ?? set.id
    }));
  };
  const registerQuickSwitches = (registry) => {
    if (quickSwitchesRegistered) return;
    const reg = registry;
    if (!reg || typeof reg.registerSwitch !== "function") return;
    quickSwitchesRegistered = true;
    quickControl = reg;
    let lastEnabled = presenter.isEnabled();
    const offScope = scope.subscribe(() => {
      const enabled = presenter.isEnabled();
      if (enabled === lastEnabled) return;
      lastEnabled = enabled;
      quickControl?.notifyChange?.(OPEN_DETAILS_SWITCH_ID);
      quickControl?.notifyChange?.(PORTRAIT_SET_SWITCH_ID);
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
      const openDispose = reg.registerSwitch?.({
        id: OPEN_DETAILS_SWITCH_ID,
        label: () => setLabel("openDetails"),
        icon: "doc",
        type: "action",
        // Built-in Appearance group (just past the portrait-set row at 26),
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
    inject: () => ({ form: configForm })
  }, FlashSkinConfigCard));
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "flash-effort-binding",
    order: 10.5,
    locale: LOCALE_NAMESPACE,
    inject: () => ({ scope })
  }, EffortBindingRow));
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
    inject: (sessionId) => {
      const available = ctx.sessions.subagentAddress(sessionId) === void 0;
      const directory = ctx.modelDirectories.directoryFor(sessionId);
      return {
        directory: directory.store,
        presenter,
        scope,
        settings: { level: readLevel() },
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
