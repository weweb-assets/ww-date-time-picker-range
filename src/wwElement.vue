<template>
  <div class="ww-date-time-picker-range">
    <!-- INLINE PICKER -->
    <DatePicker
      v-if="content.showOn === 'alwaysVisible'"
      class="ww-date-time-picker__picker"
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
      class="ww-date-time-picker__picker"
      v-model="value"
      :masks="masks"
      :color="content.color"
      :is-dark="content.isDarkMode"
      is-range
      :mode="mode"
      :rows="content.rows"
      :columns="content.columns"
      :locale="locale"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <wwElement
          class="ww-date-time-picker__text"
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.start }"
          v-on="isEditing ? null : inputEvents.start"
        />

        <wwElement
          v-if="content.startEndInputs"
          class="ww-date-time-picker__text"
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.end }"
          v-on="isEditing ? null : inputEvents.end"
        />
      </template>
    </DatePicker>

    <!-- SHOW ON CLICK -->
    <DatePicker
      v-else-if="content.showOn === 'click'"
      class="ww-date-time-picker__picker"
      v-model="value"
      :masks="masks"
      :color="content.color"
      :is-dark="content.isDarkMode"
      is-range
      :mode="mode"
      :rows="content.rows"
      :columns="content.columns"
      :locale="locale"
    >
      <template v-slot="{ inputValue, togglePopover }">
        <wwElement
          class="ww-date-time-picker__text"
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.start }"
          @click="isEditing ? null : togglePopover().start"
        />

        <wwElement
          v-if="content.startEndInputs"
          class="ww-date-time-picker__text"
          v-bind="content.dateElement"
          :wwProps="{ text: inputValue.end }"
          @click="isEditing ? null : togglePopover().end"
        />
      </template>
    </DatePicker>
  </div>
</template>

<script>
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

export default {
  components: {
    DatePicker,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props) {
    const { value: variableValue, setValue } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "value",
        type: "object",
        defaultValue:
          props.content.value === undefined
            ? {
                start: new Date(2022, 0, 6).toString(),
                end: new Date(2023, 0, 23).toString(),
              }
            : props.content.value,
      });

    return { variableValue, setValue };
  },
  data() {
    return {
      masks: {
        input: "YYYY-MM-DD h:mm A",
      },
    };
  },
  watch: {
    "content.value"(newValue) {
      if (newValue === this.value) return;
      this.setValue(newValue);
      this.$emit("trigger-event", {
        name: "initValueChange",
        event: { value: newValue },
      });
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
        return this.variableValue;
      },
      set(newValue, oldValue) {
        if (_.isEqual(newValue, oldValue)) return;

        const { start, end } = newValue;
        if (start.toString() && end.toString()) {
          this.setValue({
            start: start.toString(),
            end: end.toString(),
          });
        }
      },
    },
    mode() {
      return this.content.selectAlsoTime ? "dateTime" : "data";
    },
    locale() {
      if (this.content.lang === "pageLang") {
        return wwLib.wwLang.lang;
      }

      return this.content.lang;
    },
  },
};
</script>

<style lang="scss" scoped>
.ww-date-time-picker {
  width: inherit;
  height: inherit;
  position: relative;

  &__picker {
    display: flex;
    flex-direction: row;
  }
}
</style>
