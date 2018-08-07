import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const hostName = 'localhost:4000'
const path = '/api/todos'

const store = () => new Vuex.Store({
  state: {
    todos: []
  },
  getters: {
    allTodos (state) {
      return state.todos
    },
    activeTodos (state) {
      return state.todos.filter(todo => !todo.completed)
    },
    completedTodos (state) {
      return state.todos.filter(todo => todo.completed)
    }
  },
  mutations: {
    SET_TODOS (state, todos) {
      state.todos = todos
    },
    ADD_TODO (state, todo) {
      state.todos.push(todo)
    },
    REMOVE_TODO (state, todo) {
      var i = state.todos.indexOf(todo)
      state.todos.splice(i, 1)
    },
    FILTER_TODOS (state, value) {
      state.todos.forEach((todo) => {
        todo.completed = !value
      })
    }
  },
  actions: {
    addTodo ({ commit }, todo) {
      axios
        .post(`http://${hostName}${path}`, { todo: { title: todo.title, completed: todo.completed } })
        .then(response => {
          commit('ADD_TODO', todo)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    setTodos ({ commit }, todos) {
      commit('SET_TODOS', todos)
    },
    removeTodo ({ commit }, todo) {
      commit('REMOVE_TODO', todo)
    },
    allDone ({ state, commit }) {
      var value = state.todos.filter(todo => todo.completed).length === state.todos.length
      commit('FILTER_TODOS', value)
    },
    saveTodos ({ state }) {
      axios.put('/api/todos', { todos: state.todos })
    },
    nuxtServerInit ({ commit }, { req }) {
      commit('SET_TODOS', req.session ? (req.session.todos || []) : [])
    },
    getTodos ({ commit }) {
      axios
        .get(`http://${hostName}${path}`)
        .then(response => {
          commit('SET_TODOS', response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})

export default store
