<template>
  <section class="todoapp">
    <todo-header/>
		<section class="main" v-if="todos.length">
			<input class="toggle-all" type="checkbox" @click="allDone">
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
        <li v-for="(todo, key, index) in todos" :key="index" :class="{'completed': todo.completed, 'editing': todo === editedTodo}">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @keyup.enter="doneEdit(todo, key)" @keyup.esc="cancelEdit(todo)">
        </li>
			</ul>
		</section>
    <todo-footer/>
	</section>
</template>

<script>
import TodoHeader from "~/components/header";
import TodoFooter from "~/components/footer";

export default {
  validate({ params }) {
    return (
      !params.slug || params.slug === "active" || params.slug === "completed"
    );
  },
  head() {
    return {
      title: this.$route.params.slug || "all",
      titleTemplate: "Nuxt TodoMVC : %s todos"
    };
  },
  data() {
    return {
      editedTodo: null
    };
  },
  mounted: function() {
    this.$store.dispatch("getTodos");
  },
  computed: {
    todos() {
      if (this.$route.params.slug === "active") {
        return this.$store.getters.activeTodos;
      }
      if (this.$route.params.slug === "completed") {
        return this.$store.getters.completedTodos;
      }
      return this.$store.getters.allTodos;
    }
  },
  methods: {
    allDone() {
      this.$store.dispatch("allDone");
    },
    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },
    doneEdit(todo, key) {
      this.$store.dispatch("editTodo", { todo, key });
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.$store.dispatch("removeTodo", todo);
      }
    },
    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    removeTodo(todo) {
      this.$store.dispatch("removeTodo", todo);
    }
  },
  directives: {
    "todo-focus"(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  },
  components: {
    "todo-header": TodoHeader,
    "todo-footer": TodoFooter
  }
};
</script>
