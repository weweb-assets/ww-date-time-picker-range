export default {
  editor: {
    label: {
      en: "Range Date picker",
    },
    customStylePropertiesOrder: ["color", "isDarkMode", ["rows", "columns"]],
  },
  triggerEvents: [
    { name: "change", label: { en: "On change" }, event: { value: "" } },
    {
      name: "initValueChange",
      label: { en: "On init value change" },
      event: { value: "" },
    },
  ],
  properties: {
    showOn: {
      label: {
        en: "Show on",
      },
      type: "TextSelect",
      options: {
        options: [
          { value: "alwaysVisible", label: { en: "Always visible" } },
          { value: "hover", label: { en: "Hover" } },
          { value: "click", label: { en: "Click" } },
        ],
      },
      defaultValue: "hover",
      section: "settings",
    },
    startEndInputs: {
      hidden: (content) => content.showOn === "alwaysVisible",
      label: {
        en: "Start and end inputs?",
      },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
    selectAlsoTime: {
      label: {
        en: "Select also time",
      },
      type: "OnOff",
      defaultValue: false,
      section: "settings",
    },
    lang: {
      label: {
        en: "Lang",
        fr: "Lang",
      },
      type: "TextSelect",
      options: () => {
        const options = wwLib.wwWebsiteData
          .getCurrentPage()
          .langs.map((lang) => ({
            value: lang,
            label: { en: lang },
          }));

        options.unshift({ value: "pageLang", label: "Page lang" });

        return { options };
      },
      defaultValue: "pageLang",
      bindable: true,
      section: "settings",
    },
    color: {
      label: {
        en: "Color",
        fr: "Color",
      },
      type: "TextSelect",
      options: {
        options: [
          { value: "gray", label: { en: "Gray" } },
          { value: "red", label: { en: "Red" } },
          { value: "orange", label: { en: "Orange" } },
          { value: "yellow", label: { en: "Yellow" } },
          { value: "green", label: { en: "Green" } },
          { value: "teal", label: { en: "Teal" } },
          { value: "blue", label: { en: "Blue" } },
          { value: "indigo", label: { en: "Indigo" } },
          { value: "purple", label: { en: "Purple" } },
          { value: "pink", label: { en: "Pink" } },
        ],
      },
      defaultValue: "gray",
    },
    isDarkMode: {
      label: {
        en: "Dark mode",
      },
      type: "OnOff",
      defaultValue: false,
    },
    rows: {
      type: "Number",
      label: {
        en: "Rows",
      },
      options: () => ({
        min: 1,
        max: 12,
        step: 1,
      }),
      responsive: true,
      defaultValue: 1,
    },
    columns: {
      type: "Number",
      label: {
        en: "Columns",
      },
      options: () => ({
        min: 1,
        max: 12,
        step: 1,
      }),
      responsive: true,
      defaultValue: 1,
    },
    dateElement: {
      hidden: true,
      defaultValue: { isWwObject: true, type: "ww-text" },
    },
  },
};
