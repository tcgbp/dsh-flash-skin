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
var skin_default = `.flash-skin-backdrop {\r
  position: fixed;\r
  z-index: -1;\r
  inset: 0;\r
  overflow: hidden;\r
  pointer-events: none;\r
  background: var(--flash-page, #f5f6f8);\r
  opacity: 0;\r
  transition: opacity 220ms ease;\r
}\r
\r
body[data-flash-skin="on"] .flash-skin-backdrop {\r
  opacity: 1;\r
}\r
\r
/* Portrait sequence layer: a person image that changes with the slider. */\r
.flash-skin-backdrop .flash-skin-sequence-frame {\r
  position: absolute;\r
  top: 50%;\r
  right: 0;\r
  display: block;\r
  width: min(42vw, 720px);\r
  height: 100%;\r
  object-fit: cover;\r
  object-position: 50% 42%;\r
  opacity: var(--flash-portrait-opacity, 0.45);\r
  transform: translateY(-50%);\r
  filter: none;\r
  mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 10%, black 30%, black 100%);\r
  transition: filter 180ms linear;\r
}\r
\r
.flash-skin-backdrop img {\r
  display: none;\r
}\r
\r
.flash-skin-backdrop[data-media="sequence"] .flash-skin-sequence-frame {\r
  display: block;\r
  opacity: var(--flash-portrait-opacity, 0.6);\r
}\r
\r
.flash-skin-backdrop[data-media="color"] img {\r
  display: none;\r
}\r
\r
/* \u4E3B\u9898\u8272/\u6309\u94AE/accent/\u8FB9\u6846/\u6587\u5B57/layer \u7B49 token \u67D3\u8272 \u2014\u2014 \u5DF2\u6309\u8981\u6C42\u79FB\u9664\uFF0C\r
 * \u9875\u9762\u6062\u590D App \u539F\u751F\u4E3B\u9898\u6837\u5F0F\u3002\u4EC5\u4FDD\u7559\u201C\u80CC\u666F\u900F\u51FA\u201D\u6700\u5C0F\u5FC5\u8981\u89C4\u5219\uFF1A\r
 * .flash-skin-backdrop \u4EBA\u7269\u7167\u5C42\u662F z-index:-1 \u7684\u5E95\u5C42\u56FA\u5B9A\u5C42\uFF0C\r
 * \u5FC5\u987B\u8BA9 App \u57FA\u7840\u80CC\u666F\u900F\u660E\u624D\u80FD\u900F\u51FA\u6765\uFF08\u5426\u5219\u88AB\u539F\u751F\u4E0D\u900F\u660E\u80CC\u666F\u76D6\u4F4F\uFF09\u3002\r
 * body \u5E95\u8272\u4ECD\u7531 backdrop \u5C42\u81EA\u8EAB\u7684 --flash-page \u63D0\u4F9B\u3002 */\r
body[data-flash-skin="on"] {\r
  --dsw-alias-bg-base: transparent !important;\r
  background: var(--flash-page) !important;\r
}\r
\r
body[data-flash-skin="on"] > #root {\r
  background: transparent !important;\r
}\r
\r
body[data-flash-skin="on"] button,\r
body[data-flash-skin="on"] input,\r
body[data-flash-skin="on"] textarea {\r
  transition: color 160ms linear, background-color 160ms linear, border-color 160ms linear;\r
}\r
\r
.flash-level-control {\r
  --flash-control-accent: var(--flash-accent, #4176e6);\r
  --flash-control-rail: var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r
  position: relative;\r
  display: flex;\r
  width: 124px;\r
  height: 28px;\r
  align-items: center;\r
  margin: 0 3px;\r
}\r
\r
.flash-level-control__range {\r
  position: relative;\r
  z-index: 1;\r
  width: 100%;\r
  height: 28px;\r
  cursor: ew-resize;\r
  appearance: none;\r
  background: transparent;\r
  touch-action: pan-y;\r
}\r
\r
.flash-level-control__range::-webkit-slider-runnable-track {\r
  height: 6px;\r
  border-radius: 3px;\r
  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\r
}\r
\r
.flash-level-control__range::-webkit-slider-thumb {\r
  width: 15px;\r
  height: 15px;\r
  margin-top: -4.5px;\r
  border: 2px solid var(--flash-accent, #4176e6);\r
  border-radius: 50%;\r
  appearance: none;\r
  background: #fff;\r
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);\r
}\r
\r
.flash-level-control__range::-moz-range-track {\r
  height: 6px;\r
  border-radius: 3px;\r
  background: linear-gradient(90deg, var(--flash-accent, #4176e6), var(--flash-ink, #191b1e));\r
}\r
\r
.flash-level-control__range::-moz-range-thumb {\r
  width: 11px;\r
  height: 11px;\r
  border: 2px solid var(--flash-accent, #4176e6);\r
  border-radius: 50%;\r
  background: #fff;\r
}\r
\r
.flash-level-control__range:focus-visible {\r
  outline: none;\r
}\r
\r
.flash-level-control__ticks {\r
  position: absolute;\r
  inset: 0;\r
  pointer-events: none;\r
}\r
\r
.flash-level-control__tick {\r
  position: absolute;\r
  top: 11px;\r
  width: 2px;\r
  height: 6px;\r
  border-radius: 1px;\r
  background: var(--flash-control-rail, rgb(0 0 0 / 16%));\r
}\r
\r
.flash-level-control__tooltip {\r
  position: absolute;\r
  bottom: 30px;\r
  left: calc(var(--flash-slider-ratio, 0) * 100%);\r
  transform: translateX(-50%);\r
  padding: 3px 8px;\r
  border-radius: 6px;\r
  background: var(--flash-ink, #191b1e);\r
  color: var(--flash-page, #f5f6f8);\r
  font-size: 11px;\r
  line-height: 1.4;\r
  white-space: nowrap;\r
  pointer-events: none;\r
  z-index: 3;\r
}\r
\r
.flash-appearance-binding {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  gap: 12px;\r
  width: 100%;\r
  margin: 2px 0;\r
}\r
\r
.flash-appearance-binding[data-plugin] {\r
  min-width: 260px;\r
}\r
\r
.flash-portrait-set[data-plugin] {\r
  box-sizing: border-box;\r
  display: grid;\r
  gap: 8px;\r
  width: 100%;\r
  margin: 2px 0;\r
}\r
\r
.flash-portrait-set__label {\r
  color: var(--dsw-alias-label-secondary);\r
  font-size: 13px;\r
  line-height: 18px;\r
}\r
\r
.flash-appearance-sets {\r
  box-sizing: border-box;\r
  display: grid;\r
  gap: 12px;\r
  width: 100%;\r
  margin: 2px 0;\r
}\r
\r
.flash-appearance-sets[data-plugin] {\r
  grid-template-columns: 1fr;\r
}\r
\r
/* \u6BCF\u7EC4\u4EBA\u7269\u8096\u50CF\u5360\u4E00\u6574\u884C\uFF1A\u5DE6\u4FA7\u4E3A\u8EAB\u4EFD\uFF08\u25C8 + \u7EC4\u540D\uFF09\uFF0C\u53F3\u4FA7\u80F6\u7247\u6761\u94FA\u6EE1\u5269\u4F59\u5BBD\u5EA6\uFF0C\r
 * \u9010\u5E27\u5C55\u793A\u8BE5\u7EC4\u7684\u5168\u90E8\u7D20\u6750\uFF1B\u4E00\u884C\u653E\u4E0D\u4E0B\u65F6\u81EA\u52A8\u6362\u884C\uFF0C\u4E0D\u4EA7\u751F\u6A2A\u5411\u6EDA\u52A8\u6761\u3002 */\r
.flash-appearance-choice {\r
  box-sizing: border-box;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  flex-direction: row;\r
  justify-content: flex-start;\r
  align-items: center;\r
  gap: 14px;\r
  padding: 12px 14px;\r
  border-radius: 14px;\r
  font: inherit;\r
  color: var(--dsw-alias-label-primary);\r
  cursor: pointer;\r
  background: transparent;\r
  font-size: 14px;\r
  line-height: 22px;\r
  text-align: left;\r
  display: flex;\r
}\r
\r
.flash-appearance-choice:hover:not([aria-checked="true"]) {\r
  background: var(--dsw-alias-interactive-bg-hover);\r
}\r
\r
.flash-appearance-choice[aria-checked="true"],\r
.flash-appearance-choice.flash-appearance-choice--on {\r
  border-color: var(--dsw-static-neutral-bluish-400);\r
  background: var(--dsw-alias-bg-module-platform);\r
}\r
\r
.flash-appearance-choice__identity {\r
  display: flex;\r
  flex: 0 0 auto;\r
  align-items: center;\r
  gap: 8px;\r
  min-width: 92px;\r
  white-space: nowrap;\r
}\r
\r
.flash-appearance-choice__filmstrip {\r
  display: flex;\r
  flex-wrap: wrap;\r
  flex: 1 1 auto;\r
  min-width: 0;\r
  align-items: center;\r
  gap: 6px;\r
  overflow: visible;\r
  padding: 2px 2px 6px;\r
}\r
\r
.flash-appearance-choice__frame {\r
  display: block;\r
  flex: 0 0 auto;\r
  width: 52px;\r
  height: 52px;\r
  border-radius: 6px;\r
  object-fit: cover;\r
  object-position: 50% 30%;\r
}\r
\r
.flash-appearance-choice__icon {\r
  display: block;\r
  flex: 0 0 16px;\r
  width: 16px;\r
  height: 16px;\r
  color: currentColor;\r
  font-size: 16px;\r
  line-height: 16px;\r
}\r
\r
.flash-appearance-choice__label {\r
  display: block;\r
}\r
\r
.flash-appearance-choice:disabled {\r
  cursor: progress;\r
  opacity: 0.7;\r
}\r
\r
@media (max-width: 760px) {\r
  .flash-level-control {\r
    width: 92px;\r
  }\r
}\r
\r
@media (prefers-reduced-motion: reduce) {\r
  .flash-skin-backdrop {\r
    transition: none;\r
  }\r
}\r
\r
/* ---------------------------------------------------------------------------\r
 * \u81EA\u5B9A\u4E49\u914D\u7F6E\u9875\uFF1A\u8096\u50CF\u76AE\u80A4\u7EC4\u7BA1\u7406\u5668\uFF08plugins.bundle.config \u9875\u9762\u89C6\u56FE\uFF09\r
 * \u6CBF\u7528\u4E0A\u5C42 --dsw-* \u522B\u540D\u4E0E --flash-* \u53D8\u91CF\uFF0C\u9002\u914D\u660E\u6697\u4E24\u5957\u4E3B\u9898\u3002\r
 * ------------------------------------------------------------------------- */\r
\r
.flash-portrait-groups {\r
  font-size: 14px;\r
  line-height: 22px;\r
  color: var(--dsw-alias-label-primary);\r
  border: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\r
  background: var(--dsw-alias-bg-layer-3, #fff);\r
  border-radius: 12px;\r
  transition: border-color 0.16s, background 0.16s;\r
}\r
\r
.flash-portrait-groups:hover {\r
  border-color: var(--dsw-alias-label-dimmed, #c8ccd4);\r
}\r
\r
.flash-portrait-groups--open {\r
  background: var(--dsw-alias-bg-layer-2, #f7f8fa);\r
  border-color: var(--dsw-alias-label-dimmed, #c8ccd4);\r
}\r
\r
/* \u63D2\u4EF6\u8BE6\u60C5\u9875\u6574\u5361\u6298\u53E0\uFF08\u53C2\u7167 dshmarket \u8BBE\u7F6E\u5361\u4EA4\u4E92\uFF09\uFF1A\u6574\u884C header \u53EF\u70B9\u51FB\uFF0C\r
 * \u5DE6\u4FA7\u6807\u9898 + \u63CF\u8FF0\uFF0C\u53F3\u4FA7 chevron \u5C55\u5F00\u65F6\u65CB\u8F6C 180\xB0\uFF1B\u4E3B\u4F53\u9ED8\u8BA4\u6536\u8D77\uFF0C\u6BCF\u6B21\u8FDB\u5165\r
 * \u8BE6\u60C5\u9875\u91CD\u7F6E\uFF0C\u4E0D\u505A\u6301\u4E45\u5316\u3002\u6298\u53E0\u4EC5\u9690\u85CF body\u3001\u4FDD\u7559\u6302\u8F7D\uFF0C\u4EE5\u4FDD\u5168\u7F16\u8F91\u4E2D\u77AC\u65F6\u72B6\u6001\u3002 */\r
.flash-portrait-groups__head {\r
  appearance: none;\r
  width: 100%;\r
  font: inherit;\r
  color: inherit;\r
  text-align: left;\r
  cursor: pointer;\r
  background: transparent;\r
  border: 0;\r
  border-radius: 12px;\r
  display: flex;\r
  align-items: center;\r
  gap: 12px;\r
  padding: 14px 16px;\r
}\r
\r
.flash-portrait-groups__head-text {\r
  display: flex;\r
  flex-direction: column;\r
  flex: 1;\r
  gap: 4px;\r
  min-width: 0;\r
}\r
\r
.flash-portrait-groups__title {\r
  margin: 0;\r
  color: var(--dsw-alias-label-primary);\r
  font-size: 15px;\r
  font-weight: 600;\r
  line-height: 1.4;\r
}\r
\r
.flash-portrait-groups__desc {\r
  margin: 0;\r
  color: var(--dsw-alias-label-tertiary);\r
  font-size: 13px;\r
  line-height: 1.5;\r
}\r
\r
.flash-portrait-groups__chevron {\r
  color: var(--dsw-alias-label-tertiary);\r
  flex: none;\r
  display: block;\r
  transform-origin: 50% 50%;\r
  transition: transform 0.16s;\r
}\r
\r
.flash-portrait-groups__chevron--open {\r
  transform: rotate(180deg);\r
}\r
\r
.flash-portrait-groups:not(.flash-portrait-groups--open) .flash-portrait-groups__body {\r
  display: none;\r
}\r
\r
.flash-portrait-groups__body {\r
  border-top: 1px solid var(--dsw-alias-border-l2, #e5e7eb);\r
  margin: 0 16px;\r
  padding-bottom: 8px;\r
}\r
\r
/* \u5361\u7247\u6839\u7EA7\u63D0\u793A\uFF08\u52A0\u8F7D\u6001 / \u53EA\u8BFB\u63D0\u793A\uFF09\uFF1A\u4E0E header/body \u5185\u5BB9\u540C\u4FA7\u7559\u767D\u3002 */\r
.flash-portrait-groups__notice--root {\r
  padding: 14px 16px;\r
  margin: 0;\r
}\r
\r
.flash-portrait-groups__hint,\r
.flash-portrait-groups__notice {\r
  margin: 6px 0 14px;\r
  color: var(--dsw-alias-label-tertiary);\r
  font-size: 12px;\r
  line-height: 18px;\r
}\r
\r
.flash-portrait-groups__empty {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: flex-start;\r
  gap: 10px;\r
  padding: 16px;\r
  border: 1px dashed var(--dsw-alias-border-l2);\r
  border-radius: 12px;\r
}\r
\r
.flash-portrait-group {\r
  padding: 14px 0 16px;\r
  border-bottom: 1px solid var(--dsw-alias-border-l1);\r
}\r
\r
.flash-portrait-group:last-child {\r
  border-bottom: none;\r
}\r
\r
.flash-portrait-group__head {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  gap: 12px;\r
  margin-bottom: 10px;\r
}\r
\r
/* \u8EAB\u4EFD\u884C\uFF1Aset id + \u4E2D\u82F1\u6587\u540D\u79F0\u4E09\u4E2A\u5185\u8054\u8F93\u5165\u5361\uFF0Cid \u8F93\u5165\u7A84\u4E00\u4E9B\u4EE5\u793A\u5176\u4E3A\u6301\u4E45\u5316\u6807\u8BC6\u3002\r
   \u6BCF\u5F20\u8F93\u5165\u5361\u81EA\u5E26\u4E00\u4E2A\u53EF\u89C1\u7684\u6587\u5B57\u6807\u7B7E\uFF08caption\uFF09\uFF0C\u8BF4\u660E\u8BE5\u5B57\u6BB5\u662F\u4EC0\u4E48\u3002 */\r
.flash-portrait-group__identity {\r
  display: flex;\r
  align-items: flex-end;\r
  gap: 10px;\r
  flex: 1 1 auto;\r
  min-width: 0;\r
}\r
\r
.flash-portrait-group__field {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 2px;\r
  flex: 1 1 0;\r
  min-width: 0;\r
}\r
\r
.flash-portrait-group__field-caption {\r
  font-size: 11px;\r
  font-weight: 600;\r
  letter-spacing: 0.02em;\r
  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));\r
  text-transform: none;\r
  user-select: none;\r
}\r
\r
.flash-portrait-group__name--id {\r
  font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;\r
  font-size: 12px;\r
}\r
\r
/* id \u5217\u7A0D\u7A84\uFF0C\u4FDD\u6301\u4E09\u4E2A\u8F93\u5165\u5361\u7684\u6A2A\u5411\u8FA8\u8BC6\u5EA6\uFF08\u6574\u5361\u5BBD\u5EA6\u7531 label \u63A7\u5236\uFF09\u3002 */\r
.flash-portrait-group__field--id {\r
  flex: 0 1 220px;\r
}\r
\r
.flash-portrait-group__name--lang {\r
  font-weight: 600;\r
}\r
\r
.flash-portrait-group__name {\r
  min-width: 0;\r
  flex: 1 1 auto;\r
  box-sizing: border-box;\r
  padding: 4px 8px;\r
  border: 1px solid transparent;\r
  border-radius: 8px;\r
  font: inherit;\r
  font-weight: 600;\r
  color: var(--dsw-alias-label-primary);\r
  background: transparent;\r
}\r
\r
.flash-portrait-group__name:hover {\r
  border-color: var(--dsw-alias-border-l2);\r
}\r
\r
.flash-portrait-group__name:focus {\r
  border-color: var(--dsw-static-neutral-bluish-400);\r
  background: var(--dsw-alias-bg-module-platform);\r
  outline: none;\r
}\r
\r
.flash-portrait-group__divider-hint {\r
  margin: 0 0 10px;\r
}\r
\r
/* Light/dark divider that sits between the portrait thumbnails. The threshold\r
   is moved step by step with the flanking arrow buttons, not by mouse drag. */\r
.flash-portrait-group__divider {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  gap: 4px;\r
  min-height: 128px;\r
  user-select: none;\r
  -webkit-user-select: none;\r
}\r
\r
.flash-portrait-group__divider::before {\r
  content: "";\r
  position: absolute;\r
  top: 4px;\r
  bottom: 4px;\r
  left: 50%;\r
  width: 2px;\r
  transform: translateX(-50%);\r
  border-radius: 999px;\r
  background: var(--dsw-alias-border-l2);\r
}\r
\r
.flash-portrait-group__divider-arrow {\r
  display: grid;\r
  place-items: center;\r
  width: 20px;\r
  height: 20px;\r
  padding: 0;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  border-radius: 999px;\r
  font-size: 10px;\r
  line-height: 1;\r
  color: var(--dsw-alias-label-secondary);\r
  background: var(--dsw-alias-bg-module-platform);\r
}\r
\r
.flash-portrait-group__divider-arrow:hover:not(:disabled) {\r
  border-color: var(--dsw-static-neutral-bluish-400);\r
  color: var(--dsw-static-neutral-bluish-400);\r
}\r
\r
.flash-portrait-group__divider-arrow:disabled {\r
  opacity: 0.35;\r
  cursor: not-allowed;\r
}\r
\r
.flash-portrait-group__divider-handle {\r
  position: relative;\r
  width: 22px;\r
  height: 22px;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  border-radius: 999px;\r
  background: var(--dsw-alias-bg-module-platform);\r
}\r
\r
.flash-portrait-group__divider-handle::after {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  margin: auto;\r
  width: 10px;\r
  height: 12px;\r
  background: linear-gradient(\r
    to right,\r
    currentColor 0 1.5px,\r
    transparent 1.5px 3px,\r
    currentColor 3px 4.5px,\r
    transparent 4.5px 6px,\r
    currentColor 6px 7.5px\r
  );\r
  color: var(--dsw-alias-label-tertiary);\r
}\r
\r
.flash-portrait-group__divider:hover::before {\r
  background: var(--dsw-static-neutral-bluish-400);\r
}\r
\r
.flash-portrait-group__actions {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 6px;\r
}\r
\r
.flash-portrait-group__actions button,\r
.flash-portrait-group__image-actions button,\r
.flash-portrait-groups__empty button,\r
.flash-portrait-group__add button,\r
.flash-portrait-groups__foot button {\r
  padding: 3px 10px;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  border-radius: 8px;\r
  font: inherit;\r
  font-size: 12px;\r
  line-height: 18px;\r
  color: var(--dsw-alias-label-primary);\r
  background: transparent;\r
  cursor: pointer;\r
}\r
\r
.flash-portrait-group__actions button:hover:not(:disabled),\r
.flash-portrait-group__image-actions button:hover:not(:disabled),\r
.flash-portrait-groups__empty button:hover:not(:disabled),\r
.flash-portrait-group__add button:hover:not(:disabled),\r
.flash-portrait-groups__foot button:hover:not(:disabled) {\r
  background: var(--dsw-alias-interactive-bg-hover);\r
}\r
\r
.flash-portrait-group__actions button:disabled,\r
.flash-portrait-group__image-actions button:disabled,\r
.flash-portrait-group__add button:disabled,\r
.flash-portrait-groups__foot button:disabled {\r
  cursor: not-allowed;\r
  opacity: 0.45;\r
}\r
\r
.flash-portrait-group__danger {\r
  border-color: color-mix(in srgb, var(--dsw-static-severity-error-default, #d54343) 55%, transparent) !important;\r
  color: var(--dsw-static-severity-error-default, #d54343) !important;\r
}\r
\r
/* Export is a neutral, non-destructive action \u2014 give it a hint of the accent\r
   so it reads as the group's "pack this set" action without shouting. */\r
.flash-portrait-group__export {\r
  color: var(--dsw-alias-interactive-fg-default, var(--dsw-alias-label-primary)) !important;\r
  border-color: color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4d8df5) 45%, transparent) !important;\r
}\r
\r
.flash-portrait-group__images {\r
  display: grid;\r
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));\r
  gap: 10px;\r
  margin: 0;\r
  padding: 0;\r
  list-style: none;\r
}\r
\r
.flash-portrait-group__image {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  gap: 6px;\r
  min-height: 128px;\r
}\r
\r
.flash-portrait-group__image img {\r
  display: block;\r
  width: 100%;\r
  aspect-ratio: 1 / 1;\r
  object-fit: cover;\r
  border-radius: 10px;\r
  background: var(--dsw-alias-bg-module-platform);\r
  transition: opacity 160ms linear;\r
}\r
\r
.flash-portrait-group__img {\r
  cursor: zoom-in;\r
}\r
\r
.flash-portrait-group__img:hover {\r
  opacity: 0.9;\r
}\r
\r
.flash-portrait-group__preview-hint {\r
  position: absolute;\r
  top: 6px;\r
  right: 6px;\r
  padding: 1px 6px;\r
  border-radius: 999px;\r
  font-size: 10px;\r
  line-height: 16px;\r
  color: #fff;\r
  background: rgb(0 0 0 / 55%);\r
  pointer-events: none;\r
}\r
\r
/* Full-size "view original" lightbox shown while a portrait thumbnail is clicked. */\r
.flash-lightbox {\r
  position: fixed;\r
  inset: 0;\r
  z-index: 2147483000;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  padding: 32px;\r
  background: rgb(0 0 0 / 72%);\r
  cursor: zoom-out;\r
}\r
\r
.flash-lightbox__img {\r
  max-width: min(92vw, calc(100vh * 0.9));\r
  max-height: 92vh;\r
  object-fit: contain;\r
  border-radius: 8px;\r
  background: var(--dsw-alias-bg-module-platform);\r
  box-shadow: 0 24px 80px rgb(0 0 0 / 55%);\r
  cursor: default;\r
}\r
\r
.flash-lightbox__close {\r
  position: absolute;\r
  top: 20px;\r
  right: 20px;\r
  width: 36px;\r
  height: 36px;\r
  display: grid;\r
  place-items: center;\r
  border-radius: 999px;\r
  font-size: 16px;\r
  line-height: 1;\r
  color: #fff;\r
  background: rgb(0 0 0 / 55%);\r
  cursor: pointer;\r
}\r
\r
.flash-lightbox__close:hover {\r
  background: rgb(0 0 0 / 75%);\r
}\r
\r
.flash-portrait-group__image-index {\r
  position: absolute;\r
  top: 6px;\r
  left: 6px;\r
  min-width: 18px;\r
  padding: 0 5px;\r
  border-radius: 999px;\r
  font-size: 11px;\r
  line-height: 18px;\r
  text-align: center;\r
  color: #fff;\r
  background: rgb(0 0 0 / 55%);\r
}\r
\r
.flash-portrait-group__image-actions {\r
  position: absolute;\r
  right: 6px;\r
  bottom: 6px;\r
  left: 6px;\r
  display: none;\r
  flex-wrap: wrap;\r
  justify-content: center;\r
  gap: 4px;\r
}\r
\r
.flash-portrait-group__image:hover .flash-portrait-group__image-actions {\r
  display: flex;\r
}\r
\r
.flash-portrait-group__image-actions button {\r
  padding: 2px 7px;\r
  font-size: 11px;\r
  background: var(--dsw-alias-bg-module-platform);\r
}\r
\r
.flash-portrait-group__url {\r
  box-sizing: border-box;\r
  width: 100%;\r
  padding: 5px 8px;\r
  border: 1px solid var(--dsw-static-neutral-bluish-400);\r
  border-radius: 8px;\r
  font: inherit;\r
  font-size: 12px;\r
  line-height: 18px;\r
  color: var(--dsw-alias-label-primary);\r
  background: var(--dsw-alias-bg-module-platform);\r
}\r
\r
.flash-portrait-group__url:focus {\r
  outline: none;\r
}\r
\r
.flash-portrait-group__add button {\r
  align-self: stretch;\r
  min-height: 128px;\r
  border-style: dashed;\r
  color: var(--dsw-alias-label-tertiary);\r
}\r
\r
.flash-portrait-group__add button.flash-portrait-group__add-pick {\r
  align-self: auto;\r
  min-height: 0;\r
  border-style: solid;\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-portrait-group__add button:hover:not(:disabled) {\r
  border-style: dashed;\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-portrait-group__add button.flash-portrait-group__add-pick:hover:not(:disabled) {\r
  border-style: solid;\r
}\r
\r
.flash-portrait-groups__notice--error {\r
  color: var(--dsw-static-severity-error-default, #d54343);\r
}\r
\r
.flash-portrait-groups__conflict {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 8px;\r
  margin-bottom: 12px;\r
  padding: 10px 12px;\r
  border: 1px solid var(--dsw-static-severity-error-default, #d54343);\r
  border-radius: 8px;\r
}\r
\r
.flash-portrait-groups__conflict-actions {\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: flex-end;\r
  gap: 10px;\r
}\r
\r
.flash-portrait-groups__foot {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  margin-top: 14px;\r
}\r
\r
.flash-portrait-groups__foot button {\r
  padding: 5px 12px;\r
}\r
\r
/* Network import: bundled example-archive quick picks (left) and a paste-any-URL\r
 * field (right). Both funnel into the same archive-import engine as the local\r
 * picker, so presentation stays light: flex rows + the shared input style. */\r
.flash-import-net {\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: center;\r
  gap: 12px 16px;\r
  margin-top: 12px;\r
}\r
\r
.flash-import-net__label {\r
  font-size: 12px;\r
  color: var(--dsw-alias-label-secondary, #7a818b);\r
  margin-right: 2px;\r
}\r
\r
.flash-import-net__row {\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: center;\r
  gap: 6px;\r
}\r
\r
.flash-import-net__example {\r
  padding: 3px 10px;\r
}\r
\r
.flash-import-net__example em {\r
  font-style: normal;\r
  opacity: 0.72;\r
  margin-left: 2px;\r
}\r
\r
.flash-import-net__url {\r
  display: flex;\r
  align-items: center;\r
  gap: 8px;\r
  flex: 1 1 320px;\r
  min-width: 0;\r
}\r
\r
.flash-import-net__url .flash-weights__input {\r
  flex: 1 1 auto;\r
  min-width: 0;\r
}\r
\r
.flash-import-net__url button {\r
  padding: 5px 12px;\r
  flex: 0 0 auto;\r
}\r
\r
/* =========================================================================\r
 * \u5C45\u5DE6\u5E03\u5C40\u8986\u76D6 \u2014\u2014 \u53EF\u8C03\u5BBD\u5EA6\u5BF9\u8BDD\u5185\u5BB9\u533A\uFF08\u76EE\u6807\u5BBF\u4E3B 0.2.1-rc.2\uFF09\r
 *\r
 * \u9700\u8986\u76D6\u7684\u539F\u751F\u89C4\u5219\uFF08dsh-client-ui-chat / -conversation \u7F16\u8BD1\u4EA7\u7269\uFF09\uFF1A\r
 *   .EvIC1a_column{max-width:var(--dsh-chat-content-width);width:100%;margin:0 auto}\r
 *   .wSkVaW_widthHandle{width:min(10px,calc((100% - var(--dsh-chat-content-width)) / 2 - 24px - 24px));...}\r
 *   .wSkVaW_widthHandle[data-side=left ]{right:calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\r
 *   .wSkVaW_widthHandle[data-side=right]{left :calc(50% + var(--dsh-chat-content-width) / 2 + 24px)}\r
 *\r
 * \u76EE\u6807\uFF1A\u5185\u5BB9\u5217\u7531\u201C\u4EE5\u89C6\u53E3\u4E2D\u70B9\u4E3A\u5BF9\u79F0\u8F74\u5C45\u4E2D\u201D\u6539\u4E3A\u201C\u9760\u5DE6\u5BF9\u9F50\u201D\uFF0C\u5E76\u5728\u5DE6\u4FA7\u9884\u7559\u4E00\u6BB5\r
 *       timeline \u69FD\u5BBD\uFF08\u9ED8\u8BA4 50px\uFF0C\u53EF\u8986\u76D6\u6539\uFF09\u3002\u53EA\u4FDD\u7559\u53F3\u4FA7\u62D6\u628A\uFF0C\u5E76\u628A\u53F3\u62D6\u628A\u91CD\u65B0\r
 *       \u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\u7EAF CSS\uFF0C\u53F3\u62D6\u628A\u6CBF\u7528\u539F\u751F \xD72 \u62D6\u62FD\u624B\u611F\u3002\r
 * ========================================================================= */\r
body[data-flash-skin="on"][data-flash-layout="left"] {\r
  /* \u5DE6\u4FA7\u4E3A timeline \u9884\u7559\u7684\u69FD\u5BBD\uFF08px\uFF09\u3002\u9700\u8981\u66F4\u5927/\u66F4\u5C0F\u65F6\u76F4\u63A5\u6539\u8FD9\u91CC\u3002 */\r
  --dsh-flash-timeline-gutter: 40px;\r
  /* \u53F3\u62D6\u628A\u4E0E\u5185\u5BB9\u5217\u53F3\u7F18\u7684\u95F4\u9699\uFF08\u7EE7\u627F\u539F\u751F 24px \u624B\u611F\uFF09\u3002 */\r
  --dsh-flash-handle-gap: 24px;\r
  /* \u5BF9\u9F50\u57FA\u51C6\u8F74 = \u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D\u3002\u69FD\u5BBD(50) + \u5185\u5BB9\u5217\u7236\u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u8FB9\u8DDD(\u4FA7\u4F59\u91CF16 + 16)\uFF0C\r
   * \u4F7F\u5185\u5BB9\u5217\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u3002\u6B8B\u4F59\u7ED3\u6784\u5DEE\u7528 nudge \u5FAE\u8C03\uFF08\u9ED8\u8BA4 0\uFF0C\u6B63\u53F3\u79FB\uFF09\u3002 */\r
  --dsh-flash-content-left: calc(\r
    var(--dsh-flash-timeline-gutter, 50px)\r
    + var(--dsh-composer-side-clearance, 16px) + 16px\r
  );\r
  --dsh-flash-align-nudge: 0px;\r
}\r
\r
/* 0) \u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u201C\u5B8C\u5168\u4E00\u6837\u5BBD\u201D\u3002\r
 *    \u539F\u751F .wSkVaW_body \u628A --dsh-composer-card-max-width \u8BBE\u4E3A\r
 *    calc(var(--dsh-chat-content-width) + 32px)\uFF0C\u8F93\u5165\u5361\u6BD4\u5185\u5BB9\u5217\u5BBD 32px\u3002\r
 *    \u6B64\u5904\u76F4\u63A5\u5728 .wSkVaW_body \u7EA7\u8986\u5199\u4E3A = \u5185\u5BB9\u5217\u5BBD\uFF0C\u8BA9\u8F93\u5165\u5361(+todo+\u6392\u961F\u6761)\r
 *    \u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u3001\u540C\u5DE6\u7F18\uFF0C\u53F3\u7F18\u4E5F\u9010\u70B9\u5BF9\u9F50\u3002 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .wSkVaW_body {\r
  --dsh-composer-card-max-width: var(--dsh-chat-content-width);\r
}\r
\r
/* 1) \u5185\u5BB9\u5217\u6539\u4E3A\u8D34\u5DE6\uFF1A\u5DE6\u7F18\u5BF9\u9F50\u201C\u8F93\u5165\u5361\u6700\u5DE6\u4FA7\u201D(= content-left\uFF0Cnudge \u53EF\u5FAE\u8C03)\uFF0C\r
 *    \u53F3\u8FB9\u8DDD auto\uFF08\u4E0D\u518D\u5BF9\u534A\u5C45\u4E2D\uFF09\u3002\r
 *    \u6CE8\uFF1A.EvIC1a_scroll \u81EA\u5E26 padding:16px calc(\u4FA7\u4F59\u91CF+16)\uFF0C\u6545\u8FD9\u91CC\u53BB\u6389\u7236 padding\uFF0C\r
 *    \u8BA9\u5185\u5BB9\u5217\u51C0\u5DE6\u7F18 = content-left\uFF0C\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u540C\u57FA\u51C6\u3002 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .EvIC1a_column {\r
  margin-right: auto !important;\r
  margin-left: calc(\r
    var(--dsh-flash-timeline-gutter, 50px)\r
    + var(--dsh-flash-align-nudge, 0px)\r
  ) !important;\r
}\r
\r
/* 2) \u9690\u85CF\u5DE6\u4FA7\u62D6\u628A\uFF0C\u53EA\u4FDD\u7559\u53F3\u4FA7\u3002 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .wSkVaW_widthHandle[data-side="left"] {\r
  display: none !important;\r
}\r
\r
/* 3) \u53F3\u4FA7\u62D6\u628A\u9489\u5230\u5185\u5BB9\u5217\u53F3\u7F18\u3002\r
 *    \u5217\u53F3\u7F18\u76F8\u5BF9\uFF08\u5168\u5BBD\u7684\uFF09\u5B9A\u4F4D\u7956\u5148\u7684\u6C34\u5E73\u4F4D\u79FB =\r
 *       \u6EDA\u52A8\u533A\u5DE6\u4FA7\u5185\u5BB9\u5185\u8FB9\u8DDD(var(--dsh-composer-side-clearance) + 16px)\r
 *     + timeline \u69FD 50px\r
 *     + \u5217\u5BBD var(--dsh-chat-content-width)\r
 *     + \u62D6\u628A\u95F4\u9699 24px\r
 *    \u62D6\u628A\u81EA\u8EAB\u5BBD\u5EA6\u56FA\u5B9A\u4E3A 10px\uFF08\u539F\u751F min(10px,\u2026) \u662F\u4E13\u4E3A\u5C45\u4E2D\u5E03\u5C40\u5199\u7684\uFF09\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .wSkVaW_widthHandle[data-side="right"] {\r
  left: calc(\r
    var(--dsh-composer-side-clearance, 16px) + 16px\r
    + var(--dsh-flash-timeline-gutter, 50px)\r
    + var(--dsh-chat-content-width)\r
    + var(--dsh-flash-handle-gap, 24px)\r
  ) !important;\r
  width: 10px !important;\r
}\r
\r
/* 4) \u8F93\u5165\u5361\u7247\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\uFF08\u540C\u6837\u9884\u7559\u5DE6\u4FA7 timeline \u69FD\uFF09\u3002\r
 *    \u539F\u751F\u5C45\u4E2D\u6765\u81EA\u4E24\u5C42\uFF1A\r
 *       .uV2eYG_root{...;align-items:center}             -> \u8BA9 .uV2eYG_card \u6C34\u5E73\u5C45\u4E2D\r
 *       .wSkVaW_composerHero{...;align-self:center}     -> \u8BA9 hero \u8F93\u5165\u8868\u6574\u4F53\u5C45\u4E2D\r
 *    \u8F93\u5165\u5361\u5BBD\u5DF2\u7531\u7B2C 0 \u6BB5\u8986\u76D6\u4E3A\u201C\u4E0E\u5185\u5BB9\u5217\u540C\u5BBD\u201D(--dsh-composer-card-max-width\r
 *    = --dsh-chat-content-width)\uFF0C\u6545\u53EA\u9700\u5BF9\u9F50\u5DE6\u7F18\uFF1A\r
 *       \u5185\u5BB9\u5217\u5DE6\u7F18 = \u6EDA\u52A8\u533A\u5DE6 padding(= \u4FA7\u4F59\u91CF+16px) + \u69FD\u5BBD\r
 *       \u5361\u7247\u5DE6\u7F18   = \u8F93\u5165\u6839\u5DE6 padding(= \u4FA7\u4F59\u91CF) + \u5361\u7247 margin\r
 *       => margin = \uFF08\u4FA7\u4F59\u91CF+16px + \u69FD\u5BBD\uFF09- \u4FA7\u4F59\u91CF = 16px + \u69FD\u5BBD\r
 *    \u4E0E\u76AE\u80A4\u53D8\u91CF/\u4E3B\u9898\u8026\u5408\u4F4E\uFF0C\u6539\u69FD\u5BBD\u65F6\u8F93\u5165\u5361\u4E0E\u5185\u5BB9\u5217\u540C\u6B65\u79FB\u52A8\u3002\u540C\u5BBD + \u540C\u5DE6\u7F18\r
 *    => \u8F93\u5165\u5361\u53F3\u7F18 = \u5185\u5BB9\u5217\u53F3\u7F18\uFF0C\u6EDA\u52A8\u5230\u6700\u4E0B\u6309\u94AE(\u7B2C 7 \u6BB5)\u5373\u9489\u5728\u5176\u4E0A\u65B9\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .uV2eYG_root {\r
  align-items: flex-start !important;\r
}\r
body[data-flash-skin="on"][data-flash-layout="left"] .uV2eYG_root > .uV2eYG_card {\r
  margin-left: calc(16px + var(--dsh-flash-timeline-gutter, 50px)) !important;\r
}\r
body[data-flash-skin="on"][data-flash-layout="left"] .wSkVaW_composerHero {\r
  align-self: flex-start !important;\r
}\r
\r
/* 4a) \u8F93\u5165\u6846\u4E0B\u65B9\u7684\u4F1A\u8BDD\u7EDF\u8BA1\u884C\uFF08\u4F1A\u8BDD\u7EDF\u8BA1 Pill\uFF0Cconversation.composer.dock\r
 *     \u69FD\u4F4D\u7684 ActivityPill/UsagePill\uFF0C\u5BB9\u5668 .uV2eYG_dock[data-composer-dock]\uFF09\r
 *     \u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\u539F\u751F .uV2eYG_dock{justify-content:center} \u5C45\u4E2D\uFF0C\r
 *     \u4E14\u76AE\u80A4 .uV2eYG_root \u6539\u4E3A align-items:flex-start \u540E\u8BE5\u884C\u4F1A\u7F29\u5230\u5185\u5BB9\u5BBD\u3001\r
 *     \u8D34\u4F4F\u6839\u5DE6\u5185\u8FB9\u8DDD\uFF0C\u843D\u5728\u8F93\u5165\u5361\u5DE6\u4FA7\u3002\u8FD9\u91CC\u4EFF\u7167\u8F93\u5165\u5361(L808-810)\u7684\u57FA\u51C6\uFF0C\r
 *     \u628A\u8BE5\u884C\u6539\u4E3A\u5DE6\u5BF9\u9F50\u5E76\u65BD\u52A0\u540C\u6837\u7684 margin-left\uFF0C\u4F7F\u7EDF\u8BA1\u884C\u6700\u5DE6\u4FA7\u4E0E\u8F93\u5165\u5361\r
 *     \u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u4E0A\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .uV2eYG_dock {\r
  justify-content: flex-start !important;\r
  margin-left: calc(16px + var(--dsh-flash-timeline-gutter, 50px)) !important;\r
}\r
\r
/* 4b) \u65B0\u4F1A\u8BDD\u7A7A\u6001\u91CC\u7684\u201C\u9009\u62E9\u5DE5\u4F5C\u533A\u201D\u884C(.wSkVaW_heroWorkspaceRow)\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\r
 *     \u5B83\u662F .wSkVaW_composerStack \u7684\u76F4\u63A5\u5B50\u8282\u70B9\uFF08\u4E0E\u8F93\u5165\u5361\u3001todo\u3001\u6392\u961F\u6761\u540C\u539F\u70B9\uFF0C\r
 *     \u5E76\u4E0D\u5728 .pXSMma_* HeroShell \u5185\u90E8\uFF09\uFF0C\u539F\u751F\u9760\u5185\u8FB9\u8DDD padding-left:20px \u843D\u5728\u504F\u5DE6\r
 *     \u4F4D\u7F6E\uFF0C\u4E0E\u5DF2\u5DE6\u79FB\u7684\u8F93\u5165\u5361\u5DE6\u7F18\u9519\u4F4D\u3002\u6B64\u5904\u7528\u4E0E todo(.lXshSW_root)/\u6392\u961F\u6761\r
 *     (._7yHdaG_dock) \u5B8C\u5168\u76F8\u540C\u7684 margin-left \u57FA\u51C6\uFF0C\u5E76\u53BB\u6389\u90A3 20px \u539F\u751F\u5185\u8FB9\u8DDD\uFF0C\r
 *     \u8BA9\u82AF\u7247\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .wSkVaW_heroWorkspaceRow {\r
  margin-left: calc(\r
    var(--dsh-composer-side-clearance, 16px) + 16px\r
    + var(--dsh-flash-timeline-gutter, 50px)\r
  ) !important;\r
  margin-right: auto !important;\r
  padding-left: 0 !important;\r
}\r
\r
/* 5) todo \u4EFB\u52A1\u680F\u4E0E\u5185\u5BB9\u5217\u4E00\u8D77\u5C45\u5DE6\u3002\r
 *    TodoPanel \u6302\u8F7D\u5728 conversation.input.dock\uFF0C\u4E0E\u8F93\u5165\u5361\u540C\u5904\r
 *    .wSkVaW_composerStack\uFF1B\u539F\u751F .lXshSW_root{margin:0 auto} \u5C45\u4E2D\u3002\r
 *    \u8F93\u5165\u5361\u5DE6\u7F18\u76F8\u5BF9 stack \u539F\u70B9\u7684\u4F4D\u79FB = \u6839 padding \u5DE6(\u4FA7\u4F59\u91CF) + \u5361 margin(16+\u69FD)\r
 *      = \u4FA7\u4F59\u91CF + 16 + \u69FD\u3002\u8FD9\u91CC TodoPanel \u4E0E\u8F93\u5165\u5361\u540C\u539F\u70B9\uFF0C\r
 *    \u6545\u628A margin:0 auto \u6539\u4E3A margin-left = \u540C\u503C\u3001margin-right \u4FDD\u6301 auto\uFF0C\r
 *    \u8BA9 todo \u6761\u5E26\u7684\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361\u5DE6\u7F18\u5BF9\u9F50\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .lXshSW_root {\r
  margin-left: calc(\r
    var(--dsh-composer-side-clearance, 16px) + 16px\r
    + var(--dsh-flash-timeline-gutter, 50px)\r
  ) !important;\r
  margin-right: auto !important;\r
}\r
\r
/* 6) \u6392\u961F\u6D88\u606F\u6761\uFF08QueueDock\uFF0Cconversation.input.dock\uFF09\u4E0E\u8F93\u5165\u5361\u4E00\u8D77\u5C45\u5DE6\u3002\r
 *    QueueDock \u6302\u5728 conversation.input.dock\uFF0C\u4E0E TodoPanel(.lXshSW_root)\r
 *    \u540C\u5904 .wSkVaW_composerStack\uFF0C\u539F\u751F ._7yHdaG_dock{margin:0 auto} \u5C45\u4E2D\u3002\r
 *    \u4E0E todo \u7528\u540C\u4E00\u4E2A margin-left \u4F4D\u79FB\uFF0C\u8BA9\u6392\u961F\u6761\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361/\u5185\u5BB9\u5217\u5DE6\u7F18\u5BF9\u9F50\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] ._7yHdaG_dock {\r
  margin-left: calc(\r
    var(--dsh-composer-side-clearance, 16px) + 16px\r
    + var(--dsh-flash-timeline-gutter, 50px)\r
  ) !important;\r
  margin-right: auto !important;\r
}\r
\r
/* 6a) \u76EE\u6807\u663E\u793A\u6761\uFF08GoalBar\uFF0Cdsh-client-ui-goal\uFF0C\u6302 conversation.input.dock\uFF0C\r
 *     \u4E0E todo/\u6392\u961F\u6761\u540C\u5904 .wSkVaW_composerStack\uFF09\u3002\r
 *     \u539F\u751F .nLMEza_dock{width:calc(100% - \u2026);margin:0 auto} \u628A\u6574\u6761\u5728\u8F93\u5165\u6808\u91CC\u5C45\u4E2D\uFF0C\r
 *     .nLMEza_bar{margin:0 auto} \u518D\u5728 dock \u5185\u90E8\u628A\u767D\u8272\u6761\u5C45\u4E2D \u2014\u2014 \u4E24\u5C42\u5C45\u4E2D\u53E0\u52A0\u5BFC\u81F4\r
 *     \u76EE\u6807\u6761\u4ECD\u8D34\u7740\u89C6\u53E3\u4E2D\u7EBF\uFF0C\u6CA1\u8DDF\u7740\u5DE6\u79FB\u3002\u8FD9\u91CC\u5148\u628A dock \u4ECE\u5DE6\u9489\u6B7B\uFF08\u53BB\u6389 auto \u5C45\u4E2D\uFF0C\r
 *     \u4F7F\u516C\u5141\u5DE6\u7F18 = composerStack \u539F\u70B9\uFF09\uFF0C\u518D\u7ED9\u53EF\u89C1\u7684 .nLMEza_bar \u65BD\u52A0\u4E0E\r
 *     todo(.lXshSW_root)/\u6392\u961F\u6761(._7yHdaG_dock) \u5B8C\u5168\u76F8\u540C\u7684 margin-left \u57FA\u51C6\uFF0C\r
 *     \u8BA9\u767D\u8272\u76EE\u6807\u6761\u5DE6\u7F18\u4E0E\u8F93\u5165\u5361/\u5185\u5BB9\u5217\u5DE6\u7F18\u843D\u5728\u540C\u4E00\u6839\u5782\u76F4\u7EBF\u4E0A\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .nLMEza_dock {\r
  margin-left: 0 !important;\r
  margin-right: auto !important;\r
}\r
body[data-flash-skin="on"][data-flash-layout="left"] .nLMEza_bar {\r
  margin-left: calc(\r
    var(--dsh-composer-side-clearance, 16px) + 16px\r
    + var(--dsh-flash-timeline-gutter, 50px)\r
  ) !important;\r
}\r
\r
/* 7) \u201C\u6EDA\u52A8\u5230\u6700\u4E0B\u201D\u6309\u94AE\u4E0E\u5DE6\u79FB\u540E\u7684\u5185\u5BB9\u5217\u53F3\u7F18\u5BF9\u9F50\u3002\r
 *    \u539F\u751F .EvIC1a_toBottomSlot \u94FA\u6EE1\u6574\u5BBD(left:0 right:0)\uFF0C\u7528\r
 *    justify-content:flex-end + padding-right \u628A\u6309\u94AE\u9489\u5728\u201C\u5C45\u4E2D\u5BF9\u9F50\u65F6\u201D\r
 *    \u5185\u5BB9\u5217\u7684\u53F3\u7F18\u3002\u5185\u5BB9\u5217\u5DE6\u79FB\u69FD\u5BBD\u540E\uFF0C\u53F3\u7F18\u4E5F\u8DDF\u7740\u5DE6\u79FB\uFF0C\u6545\u628A padding-right\r
 *    \u6539\u4E3A\u201C\u53F3\u4FA7\u5B9E\u9645\u7A7A\u4F59\u201D= 100% \u2212 \u69FD\u5BBD \u2212 (\u4FA7\u4F59\u91CF+16) \u2212 \u5217\u5BBD\u3002\r
 */\r
body[data-flash-skin="on"][data-flash-layout="left"] .EvIC1a_toBottomSlot {\r
  padding-right: calc(\r
    100% - var(--dsh-flash-timeline-gutter, 50px)\r
    - var(--dsh-composer-side-clearance, 16px) - 16px\r
    - var(--dsh-chat-content-width)\r
  ) !important;\r
}\r
\r
\r
/* 8) \u5F3A\u5EA6\u9A71\u52A8\u6A21\u5F0F\u9009\u62E9\u884C\uFF08DriverRow\uFF09\u3002\r
 *    \u624B\u52A8 / \u7EFC\u5408\u52A0\u6743 \u7684\u4E24\u6BB5\u9009\u62E9\u3002\u81EA dsh-client-ui-primitives \u7684\u5BBF\u4E3B\u539F\u751F\r
 *    SegmentedControl \u6E32\u67D3\uFF08\u80F6\u56CA\u6307\u793A\u5668\u6ED1\u52A8\u7684 tablist\uFF09\uFF0C\u6837\u5F0F\u5B8C\u5168\u8DDF\u968F\u5BBF\u4E3B\r
 *    CSS-modules \u4E0E --dsw-* \u4EE4\u724C\uFF0C\u65E0\u9700\u81EA\u7ED8\u6309\u94AE\u7EC4\u3002\r
 */\r
.flash-appearance-binding--driver {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  gap: 12px;\r
  width: 100%;\r
  margin: 2px 0;\r
}\r
\r
.flash-appearance-binding__label {\r
  color: var(--dsw-alias-label-secondary);\r
  font-size: 13px;\r
  line-height: 18px;\r
  white-space: nowrap;\r
}\r
\r
/* 9) \u7EFC\u5408\u52A0\u6743\u5B9E\u65F6\u4EEA\u8868\u3002\u52A0\u6743\u6A21\u5F0F\u4E0B\u4E0D\u663E\u793A\u6ED1\u6746\uFF0C\u4EC5\u4EE5 output \u9010\u8DEF\u663E\u793A\r
 *    \u52A0\u6743\u516C\u5F0F\uFF08\u5B9E\u65F6\u4EE3\u5165\u6743\u91CD\u4E0E\u5404\u4FE1\u53F7\u56E0\u5B50\uFF09\u4E0E\u5B9E\u65F6\u8BA1\u7B97\u51FA\u7684\u5F97\u5206\u3001\u5E27\u4F4D\u3002\r
 */\r
.flash-level-control--composite {\r
  width: auto;\r
  height: auto;\r
  flex-wrap: wrap;\r
  align-items: flex-start;\r
}\r
\r
.flash-level-control__gauge {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 2px 8px;\r
  align-items: center;\r
  margin-top: 2px;\r
  padding-left: 2px;\r
  color: var(--flash-secondary, #5b6470);\r
  font-size: 10px;\r
  line-height: 1.2;\r
  font-variant-numeric: tabular-nums;\r
}\r
\r
.flash-level-control__formula {\r
  white-space: normal;\r
  word-break: break-all;\r
}\r
\r
.flash-level-control__term {\r
  white-space: nowrap;\r
}\r
\r
.flash-level-control__term b {\r
  margin-right: 0;\r
  /* ink \u4E3A\u81EA\u9002\u5E94\u6B63\u6587\u8272\uFF1A\u6D45\u8272\u4E0B\u8FD1\u9ED1\uFF0C\u6DF1\u8272\u4E0B\u8FD1\u767D\uFF0C\u516C\u5F0F\u624D\u80FD\u5728\u6DF1\u8272\u5E95\u4E0A\u53EF\u8BFB\u3002\r
   * \u6B64\u524D\u8BEF\u7528\u672A\u5B9A\u4E49\u7684 --flash-primary\uFF0C\u6052\u56DE\u9000\u5230\u6DF1\u8272 #2b3440\uFF0C\u6DF1\u8272\u4E0B\u4E0E\u5E95\u649E\u8272\u3002 */\r
  color: var(--flash-ink, #191b1e);\r
  font-weight: 600;\r
}\r
\r
.flash-level-control__term--bonus b {\r
  color: var(--flash-accent, #4176e6);\r
}\r
\r
.flash-level-control__bonus {\r
  color: var(--flash-accent, #4176e6);\r
  font-weight: 800;\r
}\r
\r
.flash-level-control__mul {\r
  color: var(--flash-accent, #4176e6);\r
  font-weight: 800;\r
  font-size: 12px;\r
  padding: 0 1px;\r
}\r
\r
.flash-level-control__plus {\r
  display: inline-block;\r
  margin: 0 2px;\r
  /* \u540C .flash-level-control__term b\uFF0C\u7528\u81EA\u9002\u5E94 ink \u800C\u975E\u672A\u5B9A\u4E49\u7684 --flash-primary\u3002 */\r
  color: var(--flash-ink, #191b1e);\r
  font-style: normal;\r
  font-weight: 700;\r
  font-size: 11px;\r
}\r
\r
.flash-level-control__score {\r
  color: var(--flash-page, #f5f7fa);\r
  background: var(--flash-ink, #171d26);\r
  border-radius: 4px;\r
  padding: 1px 5px;\r
  font-weight: 600;\r
}\r
\r
.flash-level-control__gauge .flash-level-control__frame {\r
  color: var(--flash-accent, #4176e6);\r
  font-weight: 600;\r
}\r
\r
/* 10) \u7EFC\u5408\u52A0\u6743\u6743\u91CD\u8F93\u5165\uFF08\u63D2\u4EF6\u8BE6\u60C5\u914D\u7F6E\u5361\uFF09\u3002\r
 *     \u56DB\u4E2A step=0.05 \u7684\u6570\u5B57\u8F93\u5165 + \u6062\u590D\u9ED8\u8BA4\u6309\u94AE\uFF0C\u5199\u5165 localStorage \u7531\u8FD0\u884C\u65F6\u8BFB\u53D6\u3002\r
 */\r
.flash-weights {\r
  margin-top: 20px;\r
  padding-top: 16px;\r
  border-top: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 12%));\r
}\r
\r
.flash-weights__head {\r
  margin: 0 0 6px;\r
}\r
\r
.flash-weights__title {\r
  margin: 0;\r
  font-size: 14px;\r
  font-weight: 600;\r
  line-height: 20px;\r
}\r
\r
.flash-weights__subtitle {\r
  margin: 14px 0 0;\r
  font-size: 12px;\r
  font-weight: 600;\r
  line-height: 16px;\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-weights__grid {\r
  display: grid;\r
  grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));\r
  gap: 10px;\r
  margin: 10px 0;\r
}\r
\r
.flash-weights__field {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 4px;\r
  min-width: 0;\r
}\r
\r
.flash-weights__caption {\r
  color: var(--dsw-alias-label-secondary);\r
  font-size: 12px;\r
  line-height: 16px;\r
}\r
\r
.flash-weights__desc {\r
  color: var(--dsw-alias-label-tertiary);\r
  font-size: 11px;\r
  line-height: 15px;\r
  min-height: 30px;\r
}\r
\r
.flash-weights__input {\r
  width: 100%;\r
  box-sizing: border-box;\r
  padding: 4px 6px;\r
  border: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r
  border-radius: 6px;\r
  background: var(--dsw-alias-bg-base, #fff);\r
  color: var(--dsw-alias-label-primary);\r
  font-size: 13px;\r
}\r
\r
.flash-weights__input:focus {\r
  outline: none;\r
  border-color: var(--flash-accent, #4176e6);\r
}\r
\r
.flash-weights__reset {\r
  padding: 4px 12px;\r
  border: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r
  border-radius: 6px;\r
  background: transparent;\r
  color: var(--dsw-alias-label-secondary);\r
  font-size: 12px;\r
  line-height: 16px;\r
  cursor: pointer;\r
}\r
\r
.flash-weights__reset:hover:not(:disabled) {\r
  background: var(--dsw-alias-hover, rgb(0 0 0 / 4%));\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-weights__reset:disabled {\r
  opacity: 0.6;\r
  cursor: default;\r
}\r
\r
/* \u2500\u2500 Social: like + share (C1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
\r
/* Like is read-only bookkeeping; the filled heart marks the local liked state. */\r
.flash-portrait-group__like {\r
  color: var(--dsw-alias-label-tertiary);\r
  font-variant-numeric: tabular-nums;\r
}\r
\r
.flash-portrait-group__like--on {\r
  color: var(--dsw-static-severity-warning-default, #d97706) !important;\r
  border-color: color-mix(in srgb, var(--dsw-static-severity-warning-default, #d97706) 55%, transparent) !important;\r
  background: color-mix(in srgb, var(--dsw-static-severity-warning-default, #d97706) 10%, transparent);\r
}\r
\r
/* Share packs this group into text; give it the neutral "pack this set" look. */\r
.flash-portrait-group__share {\r
  color: var(--dsw-alias-interactive-fg-default, var(--dsw-alias-label-primary)) !important;\r
  border-color: color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4d8df5) 42%, transparent) !important;\r
}\r
\r
/* Share modal sits above the lightbox so a preview can stay open behind it. */\r
.flash-share {\r
  position: fixed;\r
  inset: 0;\r
  z-index: 2147483001;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  padding: 24px;\r
  background: rgb(0 0 0 / 60%);\r
}\r
\r
.flash-share__box {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 10px;\r
  box-sizing: border-box;\r
  width: min(680px, 94vw);\r
  max-height: min(86vh, 900px);\r
  overflow: auto;\r
  padding: 18px 20px 20px;\r
  border-radius: 14px;\r
  background: var(--dsw-alias-bg-module-platform, #fff);\r
  color: var(--dsw-alias-label-primary);\r
  box-shadow: 0 24px 80px rgb(0 0 0 / 55%);\r
}\r
\r
.flash-share__head {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
}\r
\r
.flash-share__title {\r
  flex: 1;\r
  min-width: 0;\r
  margin: 0;\r
  font-size: 16px;\r
  line-height: 22px;\r
  overflow-wrap: anywhere;\r
}\r
\r
.flash-share__text {\r
  box-sizing: border-box;\r
  width: 100%;\r
  min-height: 120px;\r
  resize: vertical;\r
  padding: 8px 10px;\r
  border: 1px solid var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r
  border-radius: 8px;\r
  background: var(--dsw-alias-bg-base, #fff);\r
  color: var(--dsw-alias-label-primary);\r
  font: 12px/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;\r
  overflow-wrap: anywhere;\r
}\r
\r
.flash-share__actions {\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: center;\r
  gap: 8px;\r
}\r
\r
.flash-share__copy {\r
  color: var(--dsw-alias-interactive-fg-default, #4073e0) !important;\r
  border-color: color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4073e0) 45%, transparent) !important;\r
  font-weight: 600;\r
}\r
\r
.flash-share__copy:hover:not(:disabled) {\r
  background: color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4073e0) 12%, transparent);\r
}\r
\r
.flash-share__community {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 8px;\r
  margin-top: 6px;\r
  padding-top: 12px;\r
  border-top: 1px solid var(--dsw-alias-border-l2);\r
}\r
\r
.flash-share__community-title {\r
  margin: 0;\r
  font-size: 13px;\r
  line-height: 18px;\r
  font-weight: 600;\r
}\r
\r
/* \u2500\u2500 C2: community directory panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
\r
.flash-community {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 8px;\r
  margin: 14px 0 0;\r
  padding: 12px 14px;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  border-radius: 12px;\r
  background: color-mix(in srgb, var(--dsw-alias-bg-base, #fff) 60%, transparent);\r
}\r
\r
.flash-community__head {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
}\r
\r
.flash-community__title {\r
  flex: 1;\r
  min-width: 0;\r
  margin: 0;\r
  font-size: 14px;\r
  line-height: 20px;\r
  font-weight: 600;\r
}\r
\r
.flash-community__learn {\r
  font-size: 12px;\r
  line-height: 16px;\r
  color: var(--dsw-alias-link-text, var(--dsw-alias-interactive-fg-default));\r
  text-decoration: none;\r
}\r
\r
.flash-community__refresh,\r
.flash-community__toggle {\r
  padding: 3px 10px;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  border-radius: 8px;\r
  font: inherit;\r
  font-size: 12px;\r
  line-height: 18px;\r
  color: var(--dsw-alias-label-primary);\r
  background: transparent;\r
  cursor: pointer;\r
}\r
\r
.flash-community__refresh:hover:not(:disabled),\r
.flash-community__toggle:hover:not(:disabled) {\r
  background: var(--dsw-alias-interactive-bg-hover);\r
}\r
\r
.flash-community__refresh:disabled,\r
.flash-community__toggle:disabled {\r
  cursor: not-allowed;\r
  opacity: 0.45;\r
}\r
\r
.flash-community__list {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 6px;\r
  margin: 0;\r
  padding: 0;\r
  list-style: none;\r
}\r
\r
.flash-community__item {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  min-width: 0;\r
}\r
\r
.flash-community__set {\r
  flex: none;\r
  font-size: 12px;\r
  line-height: 16px;\r
  font-weight: 600;\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-community__url {\r
  flex: 1;\r
  min-width: 0;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
  white-space: nowrap;\r
  font-size: 12px;\r
  line-height: 16px;\r
  color: var(--dsw-alias-link-text, var(--dsw-alias-interactive-fg-default));\r
  text-decoration: none;\r
}\r
\r
.flash-community__url:hover {\r
  text-decoration: underline;\r
}\r
\r
.flash-community__import {\r
  flex: none;\r
  padding: 3px 10px;\r
  border: 1px solid color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4073e0) 45%, transparent);\r
  border-radius: 8px;\r
  font: inherit;\r
  font-size: 12px;\r
  line-height: 18px;\r
  color: var(--dsw-alias-interactive-fg-default, #4073e0);\r
  background: transparent;\r
  cursor: pointer;\r
}\r
\r
.flash-community__import:hover:not(:disabled) {\r
  background: color-mix(in srgb, var(--dsw-alias-interactive-fg-default, #4073e0) 12%, transparent);\r
}\r
\r
.flash-community__import:disabled {\r
  cursor: not-allowed;\r
  opacity: 0.45;\r
}\r
\r
/* Token/url /zip-url fields reuse .flash-weights__input; only wrap + labels. */\r
.flash-community__field {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 4px;\r
  min-width: 0;\r
}\r
\r
.flash-community__field-label {\r
  font-size: 12px;\r
  line-height: 16px;\r
  font-weight: 600;\r
  color: var(--dsw-alias-label-primary);\r
}\r
\r
.flash-community__field-hint {\r
  font-style: normal;\r
  font-size: 11px;\r
  line-height: 15px;\r
  color: var(--dsw-alias-label-tertiary);\r
}\r
\r
.flash-community__submit {\r
  padding: 4px 12px;\r
  border: none;\r
  border-radius: 8px;\r
  font: inherit;\r
  font-size: 12px;\r
  line-height: 18px;\r
  font-weight: 600;\r
  color: #fff;\r
  background: var(--flash-accent, #4176e6);\r
  cursor: pointer;\r
}\r
\r
.flash-community__submit:hover:not(:disabled) {\r
  filter: brightness(1.06);\r
}\r
\r
.flash-community__submit:disabled {\r
  cursor: not-allowed;\r
  opacity: 0.45;\r
}\r
`;

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
function levelForEffort(index, count) {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round(safe / (count - 1) * MAX_LEVEL);
}
function selectedEffortIndex(efforts, selectedId, defaultId) {
  const id = selectedId ?? defaultId;
  return id === void 0 ? -1 : efforts.findIndex((effort) => effort.id === id);
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
var COMPACTION_PULSE_BASE = 0.9;
var COMPACTION_GRACE_MS = 1500;
var COMPACTION_FADE_MS = 3500;
var COMPACTION_DROP_RATIO = 0.7;
var COMPACTION_SCORE_BONUS = 0.25;
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
function contextCompactionFactor(pulseAtMs, nowMs) {
  if (pulseAtMs === null || !Number.isFinite(pulseAtMs) || !Number.isFinite(nowMs)) return 0;
  if (nowMs < pulseAtMs) return 0;
  return COMPACTION_PULSE_BASE * freshnessDecay(
    nowMs - pulseAtMs,
    COMPACTION_GRACE_MS,
    COMPACTION_FADE_MS
  );
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
function quoteYaml(value) {
  return `'${value.replace(/'/g, "''")}'`;
}
function buildPortraitManifest(group) {
  const id = group.id.trim();
  const fallback = group.name || id || "group";
  const zh2 = (group.zh ?? "").trim() || fallback;
  const en = (group.en ?? "").trim() || fallback;
  const darkLevel = clampLevel(group.darkLevel ?? MAX_LEVEL - 1);
  return [
    "# Portrait archive exported by dsh-flash-skin",
    "# Re-importing this archive recreates the portrait group below.",
    "---",
    `id: ${quoteYaml(id)}`,
    `name: ${quoteYaml(fallback)}`,
    `zh: ${quoteYaml(zh2)}`,
    `en: ${quoteYaml(en)}`,
    `darkLevel: ${darkLevel}`,
    "...",
    ""
  ].join("\n");
}
var SHARE_PREFIX = "dsh-flash-skin-share";
var SHARE_VERSION = 1;
var SHARE_MAX_BYTES = 8 * 1024 * 1024;
var B64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64ValueOf(char) {
  const index = B64_DIGITS.indexOf(char);
  return index === -1 ? NaN : index;
}
function bytesToBase64Text(bytes) {
  let out = "";
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const a = bytes[i];
    const b = i + 1 < len ? bytes[i + 1] : 0;
    const c = i + 2 < len ? bytes[i + 2] : 0;
    out += B64_DIGITS[a >> 2];
    out += B64_DIGITS[(a & 3) << 4 | b >> 4];
    out += i + 1 < len ? B64_DIGITS[(b & 15) << 2 | c >> 6] : "=";
    out += i + 2 < len ? B64_DIGITS[c & 63] : "=";
  }
  return out;
}
function base64TextToBytes(text) {
  if (typeof text !== "string") return null;
  let t = text.replace(/\s+/g, "").replace(/=+$/, "");
  if (t.length === 0) return new Uint8Array(0);
  if (t.length % 4 === 1) return null;
  if (!/^[A-Za-z0-9+/]+$/.test(t)) return null;
  const outLen = Math.floor(t.length * 3 / 4);
  const out = new Uint8Array(outLen);
  let o = 0;
  for (let i = 0; i < t.length; i += 4) {
    const a = b64ValueOf(t[i]);
    const b = i + 1 < t.length ? b64ValueOf(t[i + 1]) : 0;
    const c = i + 2 < t.length ? b64ValueOf(t[i + 2]) : 0;
    const d = i + 3 < t.length ? b64ValueOf(t[i + 3]) : 0;
    if (![a, b, c, d].every((v) => Number.isFinite(v))) return null;
    const quad = a << 18 | b << 12 | c << 6 | d;
    if (o < outLen) out[o++] = quad >> 16 & 255;
    if (o < outLen) out[o++] = quad >> 8 & 255;
    if (o < outLen) out[o++] = quad & 255;
  }
  return out;
}
function uint8ToBase64Url(bytes) {
  return bytesToBase64Text(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlToBytes(b64url) {
  if (typeof b64url !== "string") return null;
  return base64TextToBytes(b64url.replace(/-/g, "+").replace(/_/g, "/"));
}
var textEncoder = () => new TextEncoder();
var textDecoder = () => new TextDecoder();
function buildShareText(zip, manifest) {
  const header = textEncoder().encode(JSON.stringify({ v: SHARE_VERSION, m: manifest, z: zip.length }) + "\n");
  const blob = new Uint8Array(header.length + zip.length);
  blob.set(header, 0);
  blob.set(zip, header.length);
  if (blob.length > SHARE_MAX_BYTES) return "";
  return `${SHARE_PREFIX}#${SHARE_VERSION}#${uint8ToBase64Url(blob)}`;
}
function parseShareText(text) {
  if (typeof text !== "string") return null;
  const marker = `${SHARE_PREFIX}#${SHARE_VERSION}#`;
  if (!text.startsWith(marker)) return null;
  const b64 = text.slice(marker.length);
  if (b64.length === 0 || b64.length > Math.ceil(SHARE_MAX_BYTES * 4 / 3) + 4) return null;
  const bytes = base64UrlToBytes(b64);
  if (bytes === null || bytes.length > SHARE_MAX_BYTES) return null;
  const nl = bytes.indexOf(10);
  if (nl <= 0) return null;
  let header = null;
  try {
    header = JSON.parse(textDecoder().decode(bytes.subarray(0, nl)));
  } catch {
    header = null;
  }
  if (typeof header !== "object" || header === null) return null;
  const h = header;
  if (h.v !== SHARE_VERSION) return null;
  const manifest = h.m;
  if (typeof manifest !== "object" || manifest === null || typeof manifest.id !== "string" || manifest.id.length === 0) {
    return null;
  }
  const zlen = Number(h.z);
  const zipStart = nl + 1;
  if (!Number.isInteger(zlen) || zlen < 0 || zipStart + zlen > bytes.length) return null;
  return { zip: bytes.slice(zipStart, zipStart + zlen), manifest };
}
function mergeLikeCount(liked, communityCount) {
  const community = typeof communityCount === "number" && Number.isFinite(communityCount) ? Math.max(0, Math.floor(communityCount)) : 0;
  return Math.max(community, liked ? 1 : 0);
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
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
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
var wbits = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
};
var wbits16 = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t = [];
  for (var i = 0; i < d.length; ++i) {
    if (d[i])
      t.push({ s: i, f: d[i] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym)
      maxSym = t2[i].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i < s; ++i) {
      var i2_1 = t2[i].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i;
    }
    for (; i >= 0 && dt; --i) {
      var i2_3 = t2[i].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
};
var lc = function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
};
var clen = function(cf, cl) {
  var l = 0;
  for (var i = 0; i < cl.length; ++i)
    l += cf[i] * cl[i];
  return l;
};
var wfblk = function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i = 0; i < s; ++i)
    out[o + i + 4] = dat[i];
  return (o + 4 + s) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i = 0; i < lclt.length; ++i)
    ++lcfreq[lclt[i] & 31];
  for (var i = 0; i < lcdt.length; ++i)
    ++lcfreq[lcdt[i] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i = 0; i < nlcc; ++i)
      wbits(out, p + 3 * i, lct[clim[i]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i] >> 5 & 127), p += clct[i] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i = 0; i < li; ++i) {
    var sym = syms[i];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i2) {
      return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i + 2 < s; ++i) {
      var hv = hsh(i);
      var imod = i & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i) {
        var rem = s - i;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }
    for (i = Math.max(i, wi); i < s; ++i) {
      syms[li++] = dat[i];
      ++lf[dat[i]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i, st.w = wi;
    }
  } else {
    for (var i = st.w || 0; i < s + lst; i += 65535) {
      var e = i + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i = 0; i < 256; ++i) {
    var c = i, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i] = c;
  }
  return t;
})();
var crc = function() {
  var c = -1;
  return {
    p: function(d) {
      var cr = c;
      for (var i = 0; i < d.length; ++i)
        cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;
      c = cr;
    },
    d: function() {
      return ~c;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
};
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
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
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
var fltn = function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
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
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i = 0; i < str.length; ++i)
      ar_1[i] = str.charCodeAt(i);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
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
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
};
var wzh = function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
};
var wzf = function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
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
var DRIVER_KEY = "dsh-flash-skin.driver";
var LAYOUT_KEY = "dsh-flash-skin.layout-left";
var WEIGHTS_KEY = "dsh-flash-skin.weights";
var ATTACHMENT_PATH = `/plugins/${PACKAGE_ID}/attachment`;
var EXAMPLES_PREFIX = `/plugins/${PACKAGE_ID}/examples/`;
var REMOTE_ARCHIVE_PATH = `/plugins/${PACKAGE_ID}/archive`;
var LIKE_PATH = `/plugins/${PACKAGE_ID}/like`;
var LIKES_PATH = `/plugins/${PACKAGE_ID}/likes`;
var COMMUNITY_PATH = `/plugins/${PACKAGE_ID}/community`;
var COMMUNITY_SUBMIT_PATH = `/plugins/${PACKAGE_ID}/community/submit`;
var FLASH_SKIN_LIKED_KEY = "flash-skin:liked-by-id";
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
function readLikedStore() {
  try {
    const raw = localStorage.getItem(FLASH_SKIN_LIKED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}
function writeLikedStore(next) {
  try {
    localStorage.setItem(FLASH_SKIN_LIKED_KEY, JSON.stringify(next));
  } catch {
  }
  return next;
}
async function copyTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
  }
  return fallbackCopyText(text);
}
function fallbackCopyText(text) {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
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
  // Left-aligned layout gate (persisted). Drives `data-flash-layout` on
  // <body>; the skin.css left-align rules activate only while this is ON.
  layout = restoreLayout();
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
  getLayout() {
    return this.layout;
  }
  setLayout(left) {
    if (this.disposed) return;
    this.layout = left;
    try {
      if (left) localStorage.setItem(LAYOUT_KEY, "1");
      else localStorage.setItem(LAYOUT_KEY, "0");
    } catch {
    }
    this.applyLayout();
  }
  // Mirror the skin on/off body-attribute pattern: `data-flash-layout="left"`
  // activates the gated left-align rules; removing it returns to native.
  applyLayout() {
    if (this.disposed) return;
    if (this.enabled && this.layout) document.body.dataset.flashLayout = "left";
    else document.body.removeAttribute("data-flash-layout");
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
      this.applyLayout();
      this.applyPalette();
      this.portraits.start();
    } else {
      this.root.remove();
      this.portraits.stop();
      this.root.replaceChildren();
      this.root.dataset.media = "color";
      document.body.removeAttribute("data-flash-skin");
      this.applyLayout();
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
    document.body.removeAttribute("data-flash-layout");
    delete document.body.dataset.flashStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
};
function FlashLevelControl({
  directory,
  load,
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
    if (driver === "composite") return 0;
    return clampLevel(settings.level);
  });
  const [interacting, setInteracting] = (0, import_react.useState)(false);
  const dragging = (0, import_react.useRef)(false);
  const dragStartLevel = (0, import_react.useRef)(level);
  const enabled = skin.enabled;
  (0, import_react.useEffect)(() => {
    if (enabled) load();
  }, [enabled, load]);
  (0, import_react.useEffect)(() => {
    if (enabled) presenter.setLevel(level);
    if (driver === "composite") return;
    try {
      localStorage.setItem(LEVEL_KEY, String(level));
    } catch {
    }
  }, [level, enabled, presenter, driver]);
  if (!enabled) return null;
  const progressRatio = level / MAX_LEVEL;
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
  const commit = (rawLevel) => {
    dragging.current = false;
    const next = clampLevel(rawLevel);
    setLevel(next);
    presenter.setLevel(next);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "flash-level-control",
      "data-plugin": PACKAGE_ID,
      "data-state": "ready",
      children: [
        interacting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "output",
          {
            className: "flash-level-control__tooltip",
            style: { "--flash-slider-ratio": progressRatio },
            children: `${Math.round(progressRatio * 100)}%`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            className: "flash-level-control__range",
            type: "range",
            min: 0,
            max: MAX_LEVEL,
            step: 1,
            value: level,
            disabled: state.status === "selecting",
            "aria-label": "\u76AE\u80A4\u5F3A\u5EA6",
            "aria-valuetext": `${Math.round(progressRatio * 100)}%`,
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
              if (event.key === "Escape") {
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
    { value: "composite", label: t("driver.composite") }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-appearance-binding flash-appearance-binding--driver", "data-plugin": PACKAGE_ID, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-appearance-binding__label", children: t("driver.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dsh_client_ui_primitives.SegmentedControl,
      {
        id: "flash-skin-driver",
        value: snapshot.driver,
        label: t("driver.title"),
        disabled: pending,
        options: options.map(({ value, label }) => ({ value, label })),
        onChange: (value) => {
          const driver = value === "composite" ? "composite" : "manual";
          if (pending || snapshot.driver === driver) return;
          setPending(true);
          void scope.setDriver(driver).catch(() => void 0).finally(() => setPending(false));
        }
      }
    )
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
  const lastPressureRef = (0, import_react.useRef)(null);
  const compactionPulseAtRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!enabled) {
      lastPressureRef.current = null;
      compactionPulseAtRef.current = null;
      return;
    }
    if (pressureTokens === void 0 || pressureTokens === null || !Number.isFinite(pressureTokens)) {
      lastPressureRef.current = null;
      return;
    }
    const prev = lastPressureRef.current;
    lastPressureRef.current = pressureTokens;
    if (prev !== null && Number.isFinite(prev) && prev > 0 && pressureTokens < prev * (1 - COMPACTION_DROP_RATIO)) {
      compactionPulseAtRef.current = Date.now();
    }
  }, [enabled, pressureTokens]);
  const compactionF = contextCompactionFactor(compactionPulseAtRef.current, now);
  const wBase = normalized.usage * usageF + normalized.pressure * pressureF + normalized.effort * effortF + normalized.speed * speedF;
  const compBonus = COMPACTION_SCORE_BONUS * compactionF;
  const combined = wBase + compBonus;
  const compActive = compactionF > 0;
  const lastLevelRef = (0, import_react.useRef)(-1);
  (0, import_react.useEffect)(() => {
    if (enabled) load();
  }, [enabled, load]);
  (0, import_react.useEffect)(() => {
    const next = Math.max(
      0,
      Math.min(MAX_LEVEL, Math.round(
        weightedLevel(weightsSnapshot, {
          usage: usageF,
          pressure: pressureF,
          effort: effortF,
          speed: speedF
        }) + compBonus * MAX_LEVEL
      ))
    );
    if (lastLevelRef.current !== next) {
      lastLevelRef.current = next;
      presenter.setLevel(next);
    }
    if (presenter.isEnabled()) {
      presenter.setPortraitScore(combined);
    }
  }, [
    presenter,
    weightsSnapshot,
    usageF,
    pressureF,
    effortF,
    speedF,
    compactionF,
    compBonus,
    combined
  ]);
  const count = presenter.getPortraitCount();
  const w = normalized;
  const frame = count > 0 ? frameIndexForScore(combined, count) : 0;
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__formula", children: [
          terms.map(([label2, id, weight, factor], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__term", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: label2 }),
              term(weight, factor)
            ] }),
            index < terms.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "flash-level-control__plus", children: "+" })
          ] }, id)),
          compActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "flash-level-control__plus", children: "+" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__term flash-level-control__term--bonus", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t ? t("weights.compactionShort") : "\u538B\u7F29" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-level-control__bonus", children: fmt(compBonus * MAX_LEVEL) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-level-control__score", children: [
          label("weights.score", "\u5F97\u5206"),
          " ",
          fmt(combined * MAX_LEVEL),
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
    if (raw === "manual" || raw === "composite") return raw;
  } catch {
  }
  return "composite";
}
function restoreLayout() {
  try {
    return localStorage.getItem(LAYOUT_KEY) !== "0";
  } catch {
  }
  return true;
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
      driver: event.key === DRIVER_KEY && (event.newValue === "manual" || event.newValue === "composite") ? event.newValue : snapshot.driver
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
    "cardTitle": "Flash \u76AE\u80A4",
    "cardDesc": "\u4E3A\u5BF9\u8BDD\u754C\u9762\u5E94\u7528\u968F\u63A8\u7406\u7B49\u7EA7\u5207\u6362\u7684\u89D2\u8272\u8096\u50CF\u76AE\u80A4\uFF1A\u7BA1\u7406\u8096\u50CF\u7EC4\u3001\u7B49\u7EA7\u7ED1\u5B9A\u4E0E\u7EFC\u5408\u6743\u91CD\uFF0C\u652F\u6301\u538B\u7F29\u5305\u5BFC\u5165\u4E0E\u5206\u4EAB\u3002",
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
    "exportGroup": "\u5BFC\u51FA\u538B\u7F29\u5305",
    "exportGroupTitle": "\u628A\u672C\u7EC4\u5168\u90E8\u56FE\u7247\u8FDE\u540C\u5176\u5143\u6570\u636E\uFF08\u6807\u8BC6\u3001\u4E2D\u82F1\u6587\u540D\u79F0\u3001\u6DF1\u6D45\u5207\u6362\u70B9\uFF09\u6253\u5305\u4E0B\u8F7D\u4E3A\u4E00\u4E2A .zip \u538B\u7F29\u5305\uFF0C\u53EF\u76F4\u63A5\u518D\u6B21\u5BFC\u5165",
    "exportNoImages": "\u8BE5\u7EC4\u6CA1\u6709\u56FE\u7247\uFF0C\u65E0\u53EF\u5BFC\u51FA",
    "exportDownloadFailed": "\u5BFC\u51FA\u5931\u8D25\uFF1A\u672C\u7EC4\u6709 {n} \u5F20\u56FE\u7247\uFF0C\u90E8\u5206\u56FE\u7247\u65E0\u6CD5\u4E0B\u8F7D\uFF0C\u672A\u751F\u6210\u538B\u7F29\u5305",
    "exportDone": "\u5DF2\u5BFC\u51FA\u538B\u7F29\u5305",
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
    "netUrlPlaceholder": "\u7C98\u8D34\u538B\u7F29\u5305 URL\uFF0C\u6216\u670B\u53CB\u53D1\u6765\u7684\u672C\u63D2\u4EF6\u5206\u4EAB\u6587\u672C",
    "importNet": "\u4ECE\u7F51\u7EDC\u5BFC\u5165",
    "netEmpty": "\u8BF7\u8F93\u5165\u8981\u5BFC\u5165\u7684\u538B\u7F29\u5305 URL \u6216\u5206\u4EAB\u6587\u672C",
    "zipBadLink": "\u65E0\u6CD5\u5BFC\u5165\uFF1A\u8BF7\u8F93\u5165\u6307\u5411 .zip / .tar / .tar.gz \u7684 http/https \u94FE\u63A5",
    "like": "\u70B9\u8D5E",
    "likeTitle": "\u4E3A\u8FD9\u7EC4\u8096\u50CF\u70B9\u8D5E",
    "likeCount": "\u672C\u7EC4\u83B7\u8D5E {n} \u6B21",
    "likeSyncFailed": "\u70B9\u8D5E\u672A\u540C\u6B65\u5230\u793E\u533A\uFF0C\u5DF2\u5728\u672C\u673A\u8BB0\u5F55",
    "shareGroup": "\u5206\u4EAB",
    "shareGroupTitle": "\u628A\u672C\u7EC4\u56FE\u7247\u8FDE\u540C\u6807\u8BC6\u3001\u540D\u79F0\u3001\u6DF1\u6D45\u5207\u6362\u70B9\u6253\u5305\u6210\u4E00\u6BB5\u81EA\u5305\u542B\u6587\u672C\uFF0C\u53EF\u7C98\u8D34\u7ED9\u4EFB\u4F55\u4EBA\u76F4\u63A5\u5BFC\u5165",
    "shareNoImages": "\u8BE5\u7EC4\u6CA1\u6709\u56FE\u7247\uFF0C\u65E0\u53EF\u5206\u4EAB",
    "sharePacking": "\u6B63\u5728\u6253\u5305\u2026",
    "sharePanelTitle": "\u5206\u4EAB\u300C{name}\u300D",
    "sharePanelHint": "\u4E0B\u9762\u8FD9\u6BB5\u6587\u672C\u5DF2\u5305\u542B\u672C\u7EC4\u7684\u5168\u90E8\u56FE\u7247\u4E0E\u5143\u6570\u636E\uFF0C\u590D\u5236\u540E\u53D1\u9001\u7ED9\u670B\u53CB\uFF0C\u5BF9\u65B9\u7C98\u8D34\u5230\u5BFC\u5165\u6846\u5373\u53EF\u91CD\u5EFA\u6574\u7EC4\u3002\u6587\u672C\u8F83\u5927\uFF0C\u8BF7\u5B8C\u6574\u590D\u5236\u3002",
    "shareCopy": "\u590D\u5236",
    "shareCopied": "\u5DF2\u590D\u5236\uFF0C\u53EF\u7C98\u8D34\u7ED9\u670B\u53CB",
    "shareClose": "\u5173\u95ED",
    "shareTooBig": "\u672C\u7EC4\u6253\u5305\u540E\u8FC7\u5927\uFF0C\u65E0\u6CD5\u751F\u6210\u5206\u4EAB\u6587\u672C",
    "shareFailed": "\u5206\u4EAB\u5931\u8D25\uFF1A\u90E8\u5206\u56FE\u7247\u65E0\u6CD5\u4E0B\u8F7D",
    "communityTitle": "\u793E\u533A\u5206\u4EAB",
    "communityAutoMergeTitle": "GitHub \u81EA\u52A8\u5408\u5165\u4E3A\u53EF\u9009\u589E\u5F3A\uFF1A\u9700\u7531\u4ED3\u5E93\u7BA1\u7406\u5458\u5728\u76EE\u6807\u4ED3\u5E93\u653E\u7F6E auto-merge workflow",
    "communityBrowse": "\u793E\u533A\u76EE\u5F55",
    "communityBrowseTitle": "\u6D4F\u89C8\u793E\u533A\u5206\u4EAB\u7684\u8096\u50CF\u7EC4\u5E76\u76F4\u63A5\u5BFC\u5165\uFF08\u538B\u7F29\u5305\u7531\u5206\u4EAB\u8005\u81EA\u884C\u6258\u7BA1\uFF09",
    "communityRefresh": "\u5237\u65B0",
    "communityLoading": "\u6B63\u5728\u83B7\u53D6\u793E\u533A\u76EE\u5F55\u2026",
    "communityEmpty": "\u793E\u533A\u8FD8\u6CA1\u6709\u5206\u4EAB\u3002\u70B9\u300C\u5206\u4EAB\u5230\u793E\u533A\u300D\u6210\u4E3A\u7B2C\u4E00\u4E2A\u5206\u4EAB\u8005\u3002",
    "communityError": "\u793E\u533A\u76EE\u5F55\u6682\u4E0D\u53EF\u7528",
    "communityNotConfigured": "\u793E\u533A\u76EE\u5F55\u5C1A\u672A\u914D\u7F6E\uFF08\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u7684 communityDirectory\uFF09\uFF0C\u6D4F\u89C8\u6682\u4E0D\u53EF\u7528\uFF1B\u4ECD\u53EF\u76F4\u63A5\u628A\u300C\u5206\u4EAB\u300D\u6587\u672C\u53D1\u7ED9\u670B\u53CB\u3002",
    "communityImport": "\u5BFC\u5165",
    "communityImportTitle": "\u4ECE\u8BE5\u94FE\u63A5\u5BFC\u5165\u4E3A\u4E00\u4E2A\u65B0\u7EC4",
    "communityJoin": "\u5206\u4EAB\u5230\u793E\u533A",
    "communitySubmitTitle": "\u628A\u672C\u7EC4\u7684\u6587\u672C\u6307\u9488\u63D0\u4EA4\u8FDB\u793E\u533A\u76EE\u5F55\uFF0C\u4F9B\u6240\u6709\u4EBA\u6D4F\u89C8\u5BFC\u5165",
    "communityFormTokenLabel": "GitHub \u8BBF\u95EE\u4EE4\u724C",
    "communityFormTokenHint": "\u5EFA\u8BAE\u4F7F\u7528\u4EC5\u5177 repo \u6743\u9650\u7684 Personal Access Token\uFF1A\u63D2\u4EF6\u4F1A\u4EE3\u4F60 fork \u76EE\u6807\u4ED3\u5E93\u3001\u63D0\u4EA4\u6587\u672C\u6307\u9488\u5E76\u521B\u5EFA Pull Request\u3002",
    "communityFormUrlLabel": "\u538B\u7F29\u5305 URL",
    "communityFormUrlHint": "\u8BE5\u538B\u7F29\u5305\u7531\u4F60\u81EA\u5DF1\u6258\u7BA1\uFF08\u4EFB\u610F\u516C\u5F00 URL\uFF09\uFF1B\u793E\u533A\u4ED3\u5E93\u53EA\u5B58\u8FD9\u4E00\u884C\u6587\u672C\u6307\u9488\u3002",
    "communitySubmit": "\u63D0\u4EA4\u5206\u4EAB",
    "communitySubmitting": "\u6B63\u5728\u63D0\u4EA4 PR\u2026",
    "communitySubmitDone": "\u5DF2\u63D0\u4EA4 PR\uFF1A{url}\uFF08\u9ED8\u8BA4\u4EBA\u5DE5\u5BA1\u6838\uFF0C\u662F\u5426\u5373\u65F6\u4E0A\u67B6\u53D6\u51B3\u4E8E\u4ED3\u5E93\u5408\u5165\u7B56\u7565\uFF09",
    "communitySubmitFailed": "\u63D0\u4EA4\u5931\u8D25\uFF1A{message}",
    "communityTokenMissing": "\u8BF7\u8F93\u5165 GitHub \u8BBF\u95EE\u4EE4\u724C",
    "communityUrlMissing": "\u8BF7\u8F93\u5165\u538B\u7F29\u5305 URL"
  },
  en: {
    "loading": "Loading\u2026",
    "cardTitle": "Flash Skin",
    "cardDesc": "Portrait skin for the conversation UI that switches with the reasoning level: manage portrait groups, level bindings and composite weights; import archives and share.",
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
    "netUrlPlaceholder": "Paste an archive URL, or a share text a friend sent you",
    "importNet": "Import from network",
    "netEmpty": "Enter the archive URL or share text to import",
    "zipBadLink": "Could not import: please paste an http(s) link to a .zip / .tar / .tar.gz archive",
    "like": "Like",
    "likeTitle": "Like this portrait group",
    "likeCount": "This group has {n} likes",
    "likeSyncFailed": "Like not synced to the community; recorded on this device",
    "shareGroup": "Share",
    "shareGroupTitle": "Package this group's images plus id, names and dark level into a self-contained text anyone can import",
    "shareNoImages": "This group has no images to share",
    "sharePacking": "Packing\u2026",
    "sharePanelTitle": "Share \u201C{name}\u201D",
    "sharePanelHint": "This text already contains every image and all metadata of the group. Copy it and send it to a friend \u2014 they paste it into the import field to rebuild the whole group. The text is large, so copy it completely.",
    "shareCopy": "Copy",
    "shareCopied": "Copied \u2014 paste it to a friend",
    "shareClose": "Close",
    "shareTooBig": "This group is too large to share as text",
    "shareFailed": "Share failed: some images could not be downloaded",
    "communityTitle": "Community shares",
    "communityAutoMergeTitle": "GitHub auto-merge is an optional enhancement: the repo admin drops an auto-merge workflow into the target repository",
    "communityBrowse": "Community directory",
    "communityBrowseTitle": "Browse portrait groups shared by the community and import directly (archives are hosted by the sharers themselves)",
    "communityRefresh": "Refresh",
    "communityLoading": "Loading community directory\u2026",
    "communityEmpty": "No community shares yet \u2014 press \u201CShare to community\u201D to be the first.",
    "communityError": "Community directory is unavailable",
    "communityNotConfigured": "No community directory is configured (communityDirectory in the plugin settings); browsing is unavailable, but you can still share text to friends directly.",
    "communityImport": "Import",
    "communityImportTitle": "Import from this link as a new group",
    "communityJoin": "Share to community",
    "communitySubmitTitle": "Submit this group's text pointer into the community directory for everyone to browse and import",
    "communityFormTokenLabel": "GitHub access token",
    "communityFormTokenHint": "A Personal Access Token with repo scope is recommended: the plugin forks the target repo, commits the text pointer and opens a pull request for you.",
    "communityFormUrlLabel": "Archive URL",
    "communityFormUrlHint": "Host this zip yourself (any public URL); the community repo only stores this one-line text pointer.",
    "communitySubmit": "Submit share",
    "communitySubmitting": "Submitting PR\u2026",
    "communitySubmitDone": "PR submitted: {url} (manual review by default; visibility depends on the repo's merge policy)",
    "communitySubmitFailed": "Submit failed: {message}",
    "communityTokenMissing": "Please enter a GitHub access token",
    "communityUrlMissing": "Please enter an archive URL",
    "exportGroup": "Export archive",
    "exportGroupTitle": "Pack all frames plus this group's metadata (id, Chinese/English names, light/dark threshold) into a downloadable .zip that imports straight back",
    "exportNoImages": "This group has no images \u2014 nothing to export",
    "exportDownloadFailed": "Export failed: the group has {n} images and some could not be downloaded, so no archive was written",
    "exportDone": "Archive exported"
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
var EXT_BY_MEDIA_TYPE = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif"
};
function extensionForImageUrl(url, bytes) {
  try {
    const path = new URL(url, "http://dsh.local").pathname;
    const dot = path.lastIndexOf(".");
    const ext = dot >= 0 ? path.slice(dot).toLowerCase() : "";
    if (IMAGE_EXTENSIONS.has(ext)) return ext;
  } catch {
  }
  const type = mediaTypeForEntry(url, bytes);
  return EXT_BY_MEDIA_TYPE[type] ?? ".png";
}
function dataUrlToBytes(dataUrl) {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return null;
  const meta = dataUrl.slice(0, comma);
  if (!/^data:image\/[a-z0-9.+-]+(?:;[^,]*)?$/i.test(meta)) return null;
  try {
    const raw = atob(dataUrl.slice(comma + 1).replace(/\s+/g, ""));
    const bytes = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
}
async function fetchExportImageBytes(source) {
  if (source.startsWith("data:")) {
    const bytes = dataUrlToBytes(source);
    if (bytes && bytes.length > 0) return bytes;
    throw new Error("invalid data URL");
  }
  const isHttp = source.startsWith("http://") || source.startsWith("https://");
  const banner = isHttp ? source : new URL(source, location.href).href;
  const effective = isHttp ? `${REMOTE_ARCHIVE_PATH}?url=${encodeURIComponent(banner)}` : banner;
  const response = await fetch(effective, { headers: { Accept: "image/*" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}
function sanitizeExportBase(raw) {
  const base = raw.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  return (base || "portrait-group").slice(0, 80);
}
function downloadBytes(bytes, fileName, mediaType) {
  const blob = new Blob([bytes], { type: mediaType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
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
  const [collapsed, setCollapsed] = (0, import_react.useState)(true);
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
  const [likedById, setLikedById] = (0, import_react.useState)(() => readLikedStore());
  const [communityLikes, setCommunityLikes] = (0, import_react.useState)({});
  const [likesError, setLikesError] = (0, import_react.useState)(null);
  const isLikedById = (groupId) => !!likedById[groupId];
  const likeCountFor = (groupId) => mergeLikeCount(isLikedById(groupId), communityLikes[groupId]);
  (0, import_react.useEffect)(() => {
    let cancelled = false;
    fetch(LIKES_PATH).then((response) => response.ok ? response.json() : null).then((payload) => {
      if (cancelled || !payload || typeof payload !== "object") return;
      const counts = payload.counts;
      if (counts && typeof counts === "object") {
        const normalized = {};
        for (const [key, value] of Object.entries(counts)) {
          if (typeof value === "number" && Number.isFinite(value) && value > 0) normalized[key] = value;
        }
        setCommunityLikes(normalized);
      }
    }).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const toggleLike = async (groupIndex) => {
    const group = groups[groupIndex];
    if (!group || busy) return;
    const next = !likedById[group.id];
    setLikedById((prev) => writeLikedStore({ ...prev, [group.id]: next }));
    setLikesError(null);
    try {
      const response = await fetch(LIKE_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id })
      });
      const payload = await response.json().catch(() => null);
      if (payload && typeof payload === "object" && typeof payload.count === "number") {
        setCommunityLikes((prev) => ({ ...prev, [group.id]: payload.count }));
      }
    } catch {
      setLikesError(t("likeSyncFailed"));
    }
  };
  const [shareFor, setShareFor] = (0, import_react.useState)(null);
  const [shareText, setShareText] = (0, import_react.useState)("");
  const [sharePhase, setSharePhase] = (0, import_react.useState)("idle");
  const [shareNotice, setShareNotice] = (0, import_react.useState)(null);
  const [shareCopied, setShareCopied] = (0, import_react.useState)(false);
  const shareGroup = async (groupIndex) => {
    const group = groups[groupIndex];
    if (!group) return;
    if (group.images.length === 0) {
      setShareFor({ index: groupIndex, name: group.name || group.id });
      setSharePhase("ready");
      setShareText("");
      setShareNotice(t("shareNoImages"));
      setShareCopied(false);
      return;
    }
    setShareFor({ index: groupIndex, name: group.name || group.id });
    setSharePhase("packing");
    setShareText("");
    setShareNotice(null);
    setShareCopied(false);
    try {
      const frames = [];
      for (const source of group.images) {
        try {
          const bytes = await fetchExportImageBytes(source);
          frames.push({ bytes, ext: extensionForImageUrl(source, bytes) });
        } catch {
          setSharePhase("ready");
          setShareNotice(t("shareFailed"));
          return;
        }
      }
      const entries = {
        "portrait.yaml": [strToU8(buildPortraitManifest(group)), { level: 6 }]
      };
      frames.forEach((frame, index) => {
        entries[`${index}${frame.ext}`] = frame.bytes;
      });
      const text = buildShareText(zipSync(entries, { level: 6 }), group);
      if (!text) {
        setSharePhase("ready");
        setShareNotice(t("shareTooBig"));
        return;
      }
      setShareText(text);
      setSharePhase("ready");
    } catch {
      setSharePhase("ready");
      setShareNotice(t("shareFailed"));
    }
  };
  const copyShare = async () => {
    if (!shareText) return;
    if (await copyTextToClipboard(shareText)) setShareCopied(true);
  };
  const [communityOpen, setCommunityOpen] = (0, import_react.useState)(false);
  const [communityPhase, setCommunityPhase] = (0, import_react.useState)("idle");
  const [communityEntries, setCommunityEntries] = (0, import_react.useState)([]);
  const [communityError, setCommunityError] = (0, import_react.useState)(null);
  const [communityNotConfigured, setCommunityNotConfigured] = (0, import_react.useState)(false);
  const [submitToken, setSubmitToken] = (0, import_react.useState)("");
  const [submitUrl, setSubmitUrl] = (0, import_react.useState)("");
  const [submitPhase, setSubmitPhase] = (0, import_react.useState)("idle");
  const [submitMessage, setSubmitMessage] = (0, import_react.useState)(null);
  const fetchCommunity = async () => {
    setCommunityPhase("loading");
    setCommunityError(null);
    setCommunityNotConfigured(false);
    try {
      const response = await fetch(COMMUNITY_PATH);
      const payload = await response.json().catch(() => null);
      if (!payload || typeof payload !== "object") {
        setCommunityError(t("communityError"));
        return;
      }
      setCommunityNotConfigured(payload.configured !== true && !payload.error);
      setCommunityEntries(
        Array.isArray(payload.entries) ? payload.entries.filter(
          (entry) => typeof entry === "object" && entry !== null && typeof entry.setId === "string" && typeof entry.url === "string" && typeof entry.entryId === "string"
        ) : []
      );
      if (payload.error) setCommunityError(t("communityError"));
    } catch {
      setCommunityError(t("communityError"));
    } finally {
      setCommunityPhase("ready");
    }
  };
  (0, import_react.useEffect)(() => {
    if (communityOpen && communityPhase === "idle") void fetchCommunity();
  }, [communityOpen, communityPhase]);
  const importCommunityEntry = (url) => {
    void importFromUrl(url);
  };
  const submitCommunityShare = async (groupIndex) => {
    const group = groups[groupIndex];
    const token = submitToken.trim();
    const url = submitUrl.trim();
    if (!group) return;
    if (!token) {
      setSubmitPhase("error");
      setSubmitMessage(t("communityTokenMissing"));
      return;
    }
    if (!url) {
      setSubmitPhase("error");
      setSubmitMessage(t("communityUrlMissing"));
      return;
    }
    setSubmitPhase("submitting");
    setSubmitMessage(null);
    try {
      const response = await fetch(COMMUNITY_SUBMIT_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, setId: group.id, url })
      });
      const payload = await response.json().catch(() => null);
      if (payload && payload.ok && payload.pr && typeof payload.pr.htmlUrl === "string") {
        setSubmitPhase("done");
        setSubmitMessage(t("communitySubmitDone").replace("{url}", payload.pr.htmlUrl));
      } else {
        const code = payload?.error?.code;
        setSubmitPhase("error");
        setSubmitMessage(t("communitySubmitFailed").replace("{message}", code && code !== "internal" ? code : t("communityError")));
      }
    } catch {
      setSubmitPhase("error");
      setSubmitMessage(t("communitySubmitFailed").replace("{message}", t("communityError")));
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "flash-portrait-groups", "data-plugin": PACKAGE_ID, "data-state": "loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--root", children: t("loading") }) });
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
  const exportGroup = async (groupIndex) => {
    const group = groups[groupIndex];
    if (!group) return;
    if (group.images.length === 0) {
      setFileError(t("exportNoImages"));
      return;
    }
    setBusy(true);
    try {
      const frames = [];
      for (const source of group.images) {
        try {
          const bytes = await fetchExportImageBytes(source);
          frames.push({ bytes, ext: extensionForImageUrl(source, bytes) });
        } catch {
          setFileError(t("exportDownloadFailed").replace("{n}", String(group.images.length)));
          return;
        }
      }
      const entries = {
        "portrait.yaml": [strToU8(buildPortraitManifest(group)), { level: 6 }]
      };
      frames.forEach((frame, index) => {
        entries[`${index}${frame.ext}`] = frame.bytes;
      });
      const zipped = zipSync(entries, { level: 6 });
      downloadBytes(zipped, `${sanitizeExportBase(group.id)}.zip`, "application/zip");
      setFileError(t("exportDone"));
    } finally {
      setBusy(false);
    }
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
  const runArchiveImport = async (name, buffer, shareMeta) => {
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
      if (shareMeta) {
        meta = { ...shareMeta, ...meta ?? {} };
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
    const share = parseShareText(trimmed);
    if (share) {
      const slug = (share.manifest.id || "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
      const name2 = `${slug || "share"}.zip`;
      setFileError(null);
      setBusy(true);
      try {
        const zipBytes = share.zip;
        const buffer = new ArrayBuffer(zipBytes.byteLength);
        new Uint8Array(buffer).set(zipBytes);
        await runArchiveImport(name2, buffer, share.manifest);
      } catch {
        setFileError(t("zipParseFailed"));
      } finally {
        setBusy(false);
      }
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "section",
    {
      className: `flash-portrait-groups${collapsed ? "" : " flash-portrait-groups--open"}`,
      "data-plugin": PACKAGE_ID,
      "data-state": writable ? "ready" : "readonly",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "flash-portrait-groups__head",
            "aria-expanded": !collapsed,
            "aria-controls": "flash-portrait-groups__body",
            onClick: () => setCollapsed((v) => !v),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "flash-portrait-groups__head-text", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-groups__title", children: t("cardTitle") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-groups__desc", children: t("cardDesc") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_dsh_client_ui_primitives.IconChevronDownOutlineRegular,
                {
                  className: `flash-portrait-groups__chevron${collapsed ? "" : " flash-portrait-groups__chevron--open"}`,
                  "aria-hidden": "true"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-portrait-groups__body", id: "flash-portrait-groups__body", children: [
          !writable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", role: "status", children: t("readOnly") }),
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
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: isLikedById(group.id) ? "flash-portrait-group__like flash-portrait-group__like--on" : "flash-portrait-group__like",
                      title: t("likeTitle"),
                      "aria-pressed": isLikedById(group.id),
                      disabled: busy,
                      onClick: () => void toggleLike(groupIndex),
                      children: [
                        isLikedById(group.id) ? "\u2665" : "\u2661",
                        " ",
                        likeCountFor(group.id)
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      className: "flash-portrait-group__share",
                      title: t("shareGroupTitle"),
                      disabled: busy || group.images.length === 0,
                      onClick: () => void shareGroup(groupIndex),
                      children: t("shareGroup")
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      className: "flash-portrait-group__export",
                      title: t("exportGroupTitle"),
                      disabled: busy || group.images.length === 0,
                      onClick: () => void exportGroup(groupIndex),
                      children: t("exportGroup")
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
          communityOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flash-community", "data-plugin": PACKAGE_ID, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "flash-community__head", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "flash-community__title", children: t("communityTitle") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "a",
                {
                  className: "flash-community__learn",
                  href: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request",
                  target: "_blank",
                  rel: "noreferrer",
                  children: t("communityAutoMergeTitle")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  className: "flash-community__refresh",
                  disabled: communityPhase === "loading",
                  onClick: () => void fetchCommunity(),
                  title: t("communityRefresh"),
                  children: t("communityRefresh")
                }
              )
            ] }),
            communityPhase === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", role: "status", children: t("communityLoading") }),
            communityPhase === "ready" && communityError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: communityError }),
            communityPhase === "ready" && !communityError && communityNotConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("communityNotConfigured") }),
            communityPhase === "ready" && !communityError && !communityNotConfigured && communityEntries.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("communityEmpty") }),
            communityPhase === "ready" && !communityError && !communityNotConfigured && communityEntries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "flash-community__list", children: communityEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "flash-community__item", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-community__set", children: entry.setId }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "flash-community__url", href: entry.url, target: "_blank", rel: "noreferrer", title: entry.url, children: entry.url }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  className: "flash-community__import",
                  disabled: !writable || busy,
                  onClick: () => void importCommunityEntry(entry.url),
                  title: t("communityImportTitle"),
                  children: t("communityImport")
                }
              )
            ] }, entry.entryId || entry.setId)) })
          ] }),
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "flash-community__toggle",
                disabled: busy,
                "aria-pressed": communityOpen,
                onClick: () => setCommunityOpen((value) => !value),
                title: t("communityBrowseTitle"),
                children: t("communityBrowse")
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
          ] })
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
        ),
        shareFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: "flash-share",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": t("sharePanelTitle").replace("{name}", shareFor.name),
            onClick: () => setShareFor(null),
            onKeyDown: (event) => {
              if (event.key === "Escape") setShareFor(null);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-share__box", onClick: (event) => event.stopPropagation(), children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "flash-share__head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "flash-share__title", children: t("sharePanelTitle").replace("{name}", shareFor.name) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "flash-lightbox__close",
                    onClick: () => setShareFor(null),
                    title: t("shareClose"),
                    "aria-label": t("shareClose"),
                    children: "\u2715"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("sharePanelHint") }),
              sharePhase === "packing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", role: "status", children: t("sharePacking") }),
              sharePhase === "ready" && shareText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "textarea",
                  {
                    className: "flash-share__text",
                    readOnly: true,
                    spellCheck: false,
                    value: shareText,
                    onClick: (event) => event.currentTarget.select()
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flash-share__actions", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "button",
                    {
                      type: "button",
                      className: "flash-share__copy",
                      onClick: () => void copyShare(),
                      title: t("shareCopy"),
                      children: t("shareCopy")
                    }
                  ),
                  shareCopied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-portrait-groups__notice", role: "status", children: t("shareCopied") }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: () => setShareFor(null), children: t("shareClose") })
                ] })
              ] }),
              sharePhase === "ready" && !shareText && shareNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: shareNotice }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "flash-share__community", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "flash-share__community-title", children: t("communityJoin") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__hint", children: t("communitySubmitTitle") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flash-community__field", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-community__field-label", children: t("communityFormTokenLabel") }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "input",
                    {
                      type: "password",
                      className: "flash-weights__input",
                      autoComplete: "off",
                      autoCorrect: "off",
                      spellCheck: false,
                      value: submitToken,
                      onChange: (event) => setSubmitToken(event.currentTarget.value),
                      placeholder: "ghp_\u2026"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { className: "flash-community__field-hint", children: t("communityFormTokenHint") })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flash-community__field", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flash-community__field-label", children: t("communityFormUrlLabel") }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "input",
                    {
                      type: "text",
                      className: "flash-weights__input",
                      autoComplete: "off",
                      autoCorrect: "off",
                      spellCheck: false,
                      value: submitUrl,
                      onChange: (event) => setSubmitUrl(event.currentTarget.value),
                      placeholder: "https://\u2026/group.zip"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { className: "flash-community__field-hint", children: t("communityFormUrlHint") })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash-share__actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "flash-community__submit",
                    disabled: submitPhase === "submitting" || submitToken.trim() === "" || submitUrl.trim() === "",
                    onClick: () => void submitCommunityShare(shareFor.index),
                    children: submitPhase === "submitting" ? t("communitySubmitting") : t("communitySubmit")
                  }
                ) }),
                submitPhase === "done" && submitMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice", role: "status", children: submitMessage }),
                submitPhase === "error" && submitMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "flash-portrait-groups__notice flash-portrait-groups__notice--error", role: "alert", children: submitMessage })
              ] })
            ] })
          }
        )
      ]
    }
  );
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
        "flashSkin": "Flash \u76AE\u80A4",
        "portraitSet": "\u4EBA\u7269\u8096\u50CF\u7EC4",
        "portraitSwitch": "\u4EBA\u7269\u5F3A\u5EA6",
        "layout.title": "\u5185\u5BB9\u5C45\u5DE6\u5BF9\u9F50",
        "driver.title": "\u5F3A\u5EA6\u9A71\u52A8",
        "driver.manual": "\u624B\u52A8",
        "driver.composite": "\u7EFC\u5408\u52A0\u6743",
        "weights.title": "\u7EFC\u5408\u52A0\u6743\uFF08\u624B\u52A8\u53EF\u8C03\uFF09",
        "weights.hint": "\u6309\u6743\u91CD\u5408\u6210\u7684 0\u20136 \u5F3A\u5EA6\u5B9E\u65F6\u9A71\u52A8\u4EBA\u7269\u8096\u50CF\uFF1B\u5168\u4E3A 0 \u65F6\u56DE\u9000\u9ED8\u8BA4\u6743\u91CD\u3002",
        "weights.usage": "\u7528\u91CF",
        "weights.pressure": "\u538B\u529B",
        "weights.effort": "\u63A8\u7406",
        "weights.speed": "\u901F\u5EA6",
        "weights.compaction": "\u538B\u7F29",
        "weights.usageShort": "\u7528\u91CF",
        "weights.pressureShort": "\u538B\u529B",
        "weights.effortShort": "\u63A8\u7406",
        "weights.speedShort": "\u901F\u5EA6",
        "weights.compactionShort": "\u538B\u7F29",
        "weights.usageDesc": "\u672C\u6B21\u5DF2\u751F\u6210 token,\u9971\u548C 30 \u4E07",
        "weights.pressureDesc": "\u4E0A\u4E0B\u6587\u5360\u7528/\u7A97\u53E3,\u65E0\u7A97\u53E3\u6309\u8F6E\u6B21",
        "weights.effortDesc": "\u5F53\u524D\u63A8\u7406\u6863\u4F4D,\u672A\u8BBE\u7F6E\u6309 0",
        "weights.speedDesc": "\u89E3\u7801\u901F\u5EA6,\u9971\u548C 80 t/s",
        "weights.reset": "\u6062\u590D\u9ED8\u8BA4",
        "weights.score": "\u5F97\u5206",
        "weights.frame": "\u5E27",
        "weights.speedTiming": "\u901F\u5EA6\u8870\u51CF\u8BA1\u65F6\uFF08\u6BEB\u79D2\uFF09",
        "weights.graceMs": "\u505C\u7559",
        "weights.fadeMs": "\u8870\u51CF",
        "expandDetails": "\u5C55\u5F00\u914D\u7F6E",
        "collapseDetails": "\u6536\u8D77\u914D\u7F6E"
      },
      en: {
        ...CONFIG_TEXTS.en,
        "appearance": "Portrait group",
        "flashSkin": "Flash Skin",
        "portraitSet": "Portrait set",
        "portraitSwitch": "Person level",
        "layout.title": "Left-aligned layout",
        "driver.title": "Level driver",
        "driver.manual": "Manual",
        "driver.composite": "Composite",
        "weights.title": "Composite weights (editable)",
        "weights.hint": "Live 0\u20136 portrait level synthesised from these weights; all-zero falls back to defaults.",
        "weights.usage": "Usage",
        "weights.pressure": "Pressure",
        "weights.effort": "Reasoning",
        "weights.speed": "Speed",
        "weights.compaction": "Compaction",
        "weights.usageShort": "Usage",
        "weights.pressureShort": "Pressure",
        "weights.effortShort": "Reasoning",
        "weights.speedShort": "Speed",
        "weights.compactionShort": "Compaction",
        "weights.usageDesc": "Tokens generated this turn, saturates at 300k",
        "weights.pressureDesc": "Context used / window; falls back to turns",
        "weights.effortDesc": "Current reasoning level, unknown counts as 0",
        "weights.speedDesc": "Decode speed, saturates at 80 t/s",
        "weights.reset": "Restore defaults",
        "weights.score": "Score",
        "weights.frame": "Frame",
        "weights.speedTiming": "Speed decay timing (ms)",
        "weights.graceMs": "Hold",
        "weights.fadeMs": "Fade",
        "expandDetails": "Expand settings",
        "collapseDetails": "Collapse settings"
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
  const LAYOUT_SWITCH_ID = `${PACKAGE_ID}:layout-left`;
  const FLASH_SKIN_CLUSTER = "flash-skin";
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
      cluster: FLASH_SKIN_CLUSTER,
      icon: "scroll",
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
        // This row is the CLUSTER HEAD (lowest `order` of the five skin rows);
        // the host renders its label as the fold card's title「Flash 皮肤」.
        label: () => setLabel("flashSkin"),
        clusterLabel: () => setLabel("flashSkin"),
        cluster: FLASH_SKIN_CLUSTER,
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
        cluster: FLASH_SKIN_CLUSTER,
        icon: "signal",
        type: "buttongroup",
        group: "appearance",
        order: 26.25,
        options: () => [
          { value: "manual", label: setLabel("driver.manual") },
          { value: "composite", label: setLabel("driver.composite") }
        ],
        getValue: () => scope.getSnapshot().driver,
        setValue: (value) => {
          const driver = value === "manual" || value === "composite" ? value : "manual";
          void scope.setDriver(driver).catch(() => void 0).finally(() => quickControl?.notifyChange?.(DRIVER_SWITCH_ID));
        },
        visible: () => presenter.isEnabled()
      });
      const layoutDispose = reg.registerSwitch?.({
        id: LAYOUT_SWITCH_ID,
        label: () => setLabel("layout.title"),
        cluster: FLASH_SKIN_CLUSTER,
        icon: "rail",
        type: "toggle",
        group: "appearance",
        order: 26.7,
        getValue: () => presenter.getLayout(),
        setValue: (value) => {
          presenter.setLayout(Boolean(value));
          quickControl?.notifyChange?.(LAYOUT_SWITCH_ID);
        },
        visible: () => presenter.isEnabled()
      });
      const sliderDispose = refreshPortraitSlider?.();
      const openDispose = reg.registerSwitch?.({
        id: OPEN_DETAILS_SWITCH_ID,
        label: () => setLabel("openDetails"),
        cluster: FLASH_SKIN_CLUSTER,
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
        if (typeof layoutDispose === "function") layoutDispose();
        else reg.unregisterSwitch?.(LAYOUT_SWITCH_ID);
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
        }
      };
    }
  }, FlashLevelControl));
}
return module.exports;}});
//# sourceMappingURL=client.js.map
