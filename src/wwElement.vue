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
import { DatePicker } from "./datepicker.js";
import "v-calendar/dist/style.css";

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
        name: "value - start",
        type: "string",
        defaultValue: start,
      });

    const { value: variableValueEnd, setValue: setValueEnd } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "value - end",
        type: "string",
        defaultValue: end,
      });

    return { variableValueStart, variableValueEnd, setValueStart, setValueEnd };
  },
  watch: {
    valueStart(newValue) {
      if (newValue === this.valueStart) return;
      this.setValueStart(newValue);
      this.$emit("trigger-event", {
        name: "change",
        event: { value: newValue },
      });
    },
    valueEnd(newValue) {
      if (newValue === this.valueStart) return;
      this.setValueEnd(newValue);
      this.$emit("trigger-event", {
        name: "change",
        event: { value: newValue },
      });
    },
    "content.initValueStart"(newValue) {
      if (newValue === this.valueStart) return;
      this.valueStart = newValue;
      this.$emit("trigger-event", {
        name: "initValueChange",
        event: { value: newValue },
      });
    },
    "content.initValueEnd"(newValue) {
      if (newValue === this.valueEnd) return;
      this.valueEnd = newValue;
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
          start: new Date(this.valueStart),
          end: new Date(this.valueEnd),
        };
      },
      set(newValue) {
        this.valueStart = newValue.start;
        this.valueEnd = newValue.end;
      },
    },
    valueStart: {
      get() {
        return this.variableValueStart;
      },
      set(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (newValue.toString()) this.setValueStart(newValue.toString());
      },
    },
    valueEnd: {
      get() {
        return this.variableValueEnd;
      },
      set(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (newValue.toString()) this.setValueEnd(newValue.toString());
      },
    },
    mode() {
      if (this.content.onlyTime) return "time";
      return this.content.selectAlsoTime ? "dateTime" : "date";
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
    },
  },
};
</script>

<style lang="scss" scoped>
.ww-date-time-picker-range {
  display: flex;
  flex-direction: var(--direction);
  justify-content: var(--alignement);
  align-items: var(--alignement);
}
</style>
