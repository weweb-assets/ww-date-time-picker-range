export default {
  editor: {
    label: {
      en: "Range Date picker",
    },
    customStylePropertiesOrder: [
      "direction",
      "alignement",
      "color",
      "isDarkMode",
      ["rows", "columns"],
    ],
    bubble: {
      icon: "fontawesome/regular/calendar",
    },
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
    initValueStart: {
      label: {
        en: "Start init value",
      },
      type: "Text",
      bindable: true,
      section: "settings",
    },
    initValueEnd: {
      label: {
        en: "End init value",
      },
      type: "Text",
      bindable: true,
      section: "settings",
    },
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
    onlyTime: {
      hidden: (content) => !content.selectAlsoTime,
      label: {
        en: "Select only time",
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
    mask: {
      label: {
        en: "Visualisation format",
      },
      type: "Text",
      defaultValue: "YYYY-MM-DD h:mm A",
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
    direction: {
      label: {
        en: "Direction",
        fr: "Direction",
      },
      type: "TextSelect",
      options: {
        options: [
          { value: "row", label: { en: "Horizontal" } },
          { value: "column", label: { en: "Vertical" } },
        ],
      },
      responsive: true,
      defaultValue: "row",
    },
    alignement: {
      label: {
        en: "Alignement",
      },
      type: "TextRadioGroup",
      options: (content) => {
        if (content.direction === "row") {
          return {
            choices: [
              {
                value: "flex-start",
                title: { en: "Start", fr: "Début" },
                icon: "align-x-start",
              },
              {
                value: "center",
                title: { en: "Center", fr: "Milieu" },
                icon: "align-x-center",
              },
              {
                value: "flex-end",
                title: { en: "End", fr: "Fin" },
                icon: "align-x-end",
              },
              {
                value: "space-around",
                title: { en: "Space around", fr: "Space around" },
                icon: "align-x-space-around",
              },
              {
                value: "space-between",
                title: { en: "Space between", fr: "Space between" },
                icon: "align-x-space-between",
              },
            ],
          };
        } else {
          return {
            choices: [
              {
                value: "start",
                title: { en: "Start", fr: "Début" },
                icon: "align-left",
              },
              {
                value: "center",
                title: { en: "Center", fr: "Milieu" },
                icon: "align-center",
              },
              {
                value: "end",
                title: { en: "End", fr: "Fin" },
                icon: "align-right",
              },
            ],
          };
        }
      },
      responsive: true,
      defaultValue: "center",
    },
    dateElement: {
      hidden: true,
      defaultValue: { isWwObject: true, type: "ww-text" },
    },
  },
};
