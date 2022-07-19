<template>
  <!-- INLINE PICKER -->
  <DatePicker
    v-if="content.showOn === 'alwaysVisible'"
    key="alwaysVisible"
    class="ww-date-time-picker-range"
    v-model="value"
    :masks="masks"
    :color="content.color"
    :is-dark="content.isDarkMode"
    is-range
    :mode="mode"
    :rows="content.rows"
    :columns="content.columns"
    :locale="locale"
  />

  <!-- SHOW ON HOVER -->
  <DatePicker
    v-else-if="content.showOn === 'hover'"
    key="hover"
    class="ww-date-time-picker-range"
    v-model="value"
    :masks="masks"
    :color="content.color"
    :is-dark="content.isDarkMode"
    is-range
    :mode="mode"
    :rows="content.rows"
    :columns="content.columns"
    :locale="locale"
    :style="style"
  >
    <template v-slot="{ inputValue, inputEvents }">
      <wwElement
        v-bind="content.dateElement"
        :wwProps="{ text: inputValue.start }"
        v-on="isEditing ? null : inputEvents.start"
        @mouseenter.stop="handleMouseEnter"
      />

      <wwElement
        v-if="content.startEndInputs"
        v-bind="content.dateElement"
        :wwProps="{ text: inputValue.end }"
        v-on="isEditing ? null : inputEvents.end"
        @mouseenter.stop="handleMouseEnter"
      />
    </template>
  </DatePicker>

  <!-- SHOW ON CLICK -->
  <DatePicker
    v-else-if="content.showOn === 'click'"
    key="click"
    class="ww-date-time-picker-range"
    v-model="value"
    :masks="masks"
    :color="content.color"
    :is-dark="content.isDarkMode"
    is-range
    :mode="mode"
    :rows="content.rows"
    :columns="content.columns"
    :locale="locale"
    :style="style"
  >
    <template v-slot="{ inputValue, togglePopover }">
      <div
        ref="start"
        @click="isEditing ? null : handleClick(togglePopover, 'start')"
        @mouseenter.stop="handleMouseEnter"
      >
        <wwElement
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.start }"
        />
      </div>

      <div
        v-if="content.startEndInputs"
        ref="end"
        @click="isEditing ? null : handleClick(togglePopover, 'end')"
        @mouseenter.stop="handleMouseEnter"
      >
        <wwElement
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.end }"
        />
      </div>
    </template>
  </DatePicker>
</template>

<script>
import { computed } from "vue";
import { DatePicker } from "./datepicker.js";
import "v-calendar/dist/style.css";

// TODO : Check if date is valid and apply toString here
const sanitizeDate = (date, mode = "date", type = "start") => {
  const formattedDate = new Date(date)
  if (mode === "date") {
    type === "start" ? 
      formattedDate.setHours(0, 0, 0) : 
      formattedDate.setHours(23, 59, 59);
  }

  return formattedDate;
}

export default {
  components: {
    DatePicker,
  },
  emits: ["update:content"],
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props) {
    const mode = computed(() => {
      if (props.content.onlyTime) return "time";
      return props.content.selectAlsoTime ? "dateTime" : "date";
    })
    const start =
      props.content.initValueStart === undefined
        ? new Date()
        : props.content.initValueStart;

    const d = new Date();
    const end =
      props.content.initValueEnd === undefined
        ? new Date(d.setDate(d.getDate() + 5))
        : props.content.initValueEnd;

    const { value: variableValueStart, setValue: setValueStart } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "start",
        type: "string",
        defaultValue: sanitizeDate(start, mode.value, "start").toString(),
      });

    const { value: variableValueEnd, setValue: setValueEnd } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "end",
        type: "string",
        defaultValue: sanitizeDate(end, mode.value, "end").toString(),
      });

    return { mode, variableValueStart, variableValueEnd, setValueStart, setValueEnd };
  },
  watch: {
    "content.initValueStart"(newValue, oldValue) {
      const newValueFormatted = sanitizeDate(newValue, this.mode, "start").toString() 
      const oldValueFormatted = sanitizeDate(oldValue, this.mode, "start").toString()
      const isSame = newValueFormatted === oldValueFormatted
      if (isSame) return;
      // TODO : initValueStart is triggered multiple time, it can cause issue in datetime and time mode
      this.setValueStart(newValueFormatted)
      this.$emit("trigger-event", {
        name: "initValueChange",
        event: { value: newValue },
      });
    },
    "content.initValueEnd"(newValue, oldValue) {
      const newValueFormatted = sanitizeDate(newValue, this.mode, "end").toString() 
      const oldValueFormatted = sanitizeDate(oldValue, this.mode, "end").toString()
      const isSame = newValueFormatted === oldValueFormatted
      if (isSame) return;
      // TODO : initValueEnd is triggered multiple time, it can cause issue in datetime and time mode
      this.setValueEnd(newValueFormatted)
      this.$emit("trigger-event", {
        name: "initValueChange",
        event: { value: newValue },
      });
    },
    "content.selectAlsoTime"(newValue) {
      if (newValue === false) {
        this.$emit("update:content", { onlyTime: false });
      }
    },
  },
  computed: {
    isEditing() {
      /* wwEditor:start */
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    value: {
      get() {
        return {
          start: new Date(this.variableValueStart),
          end: new Date(this.variableValueEnd),
        };
      },
      set(newValue) {
        const newValueStart = sanitizeDate(newValue.start, this.mode, "start").toString()
        const newValueEnd = sanitizeDate(newValue.end, this.mode, "end").toString()

        if (this.value.start !== newValueStart || this.value.end !== newValueEnd) {
          if (this.value.start !== newValueStart) this.setValueStart(newValueStart);
          if (this.value.end !== newValueEnd) this.setValueEnd(newValueEnd);
          this.$emit("trigger-event", {
            name: "change",
            event: { value: {
              start: newValueStart,
              end: newValueEnd
            } },
          });
        }
        
      },
    },
    masks() {
      return {
        input: this.content.mask,
      };
    },
    locale() {
      if (this.content.lang === "pageLang") {
        return wwLib.wwLang.lang;
      }
      return this.content.lang;
    },
    style() {
      return {
        "--direction": this.content.direction,
        "--alignement": this.content.alignement,
      };
    },
  },
  methods: {
    handleClick(togglePopover, target) {
      togglePopover({ ref: this.$refs[target] });
    }
  },
};
</script>

<style lang="scss" scoped>
.ww-date-time-picker-range {
  width: 100%;
  display: flex;
  flex-direction: var(--direction);
  justify-content: var(--alignement);
  align-items: var(--alignement);
}
</style>
