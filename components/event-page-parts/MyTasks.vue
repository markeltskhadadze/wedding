<script setup lang="ts">
  import {ref, Ref, onMounted, reactive, toRaw, computed, PropType, watch} from 'vue'
  import ReadyTasksModal from './ReadyTasksModal.vue'
  import AddNewEvent from '~/components/event-page-parts/AddNewEvent.vue'
  import ChooseVendorModal from '~/components/event-page-parts/ChooseVendorModal.vue'
  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
  import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  import { getImage } from '~/mixins/get-icon'
  import { eventsInfo } from '~/stores/events'
  import { businessInfo } from "~/stores/business"
  import { TEditTask, TEvents } from "~/types"
  import { screen } from '~/mixins/check-screen'

  const event = eventsInfo()
  const business = businessInfo()
  const allBusiness = reactive(toRaw(business.userBusiness))
  const { checkScreen } = screen.setup()
  const { getIcon } = getImage.setup()
  const taskDone: Ref<boolean> = ref(false)
  const filter = [
    {
      id: 1,
      name: 'До свадьбы'
    },
    {
      id: 2,
      name: 'Свадьба'
    },
    {
      id: 3,
      name: 'После свадьба'
    }
  ]
  const tasks = [
    {
      id: 1,
      name: 'Выполнено',
      is_done: true
    },
    {
      id: 2,
      name: 'Не выполнено',
      is_done: false
    },
    {
      id: 2,
      name: 'Все',
      is_done: undefined
    }
  ]
  const selectedFilter: Ref<string> = ref('')
  const selectedTask: Ref<string> = ref('')
  let taskList = reactive(toRaw(event.taskList))
  const props = defineProps({
    currentEvent: {
      type: Object as PropType<TEvents>,
      required: true
    }
  })

  const sortTasks = computed(() => {
    const groupedByDate: any = []
    const filterByDone = selectedTask.value.is_done
    if (filterByDone === undefined) {
      const fitlerByEvent = taskList.filter(task => task.event === props.currentEvent.id)
      fitlerByEvent.forEach((item) => {
        const date = new Date(item.date_time).toLocaleDateString()
        const index = groupedByDate.findIndex(group => group.date === date)
        if (index) {
          groupedByDate.push({ date, tasks: [item] })
        } else {
          groupedByDate[index].tasks.push(item)
        }
      })
      return groupedByDate
    } else {
      const fitlerByEvent = taskList.filter(task => task.event === props.currentEvent.id)
      const fitlerByStatus = fitlerByEvent.filter(task => task.is_done === filterByDone)
      fitlerByStatus.forEach((item) => {
        const date = new Date(item.date_time).toLocaleDateString()
        const index = groupedByDate.findIndex(group => group.date === date)
        if (index) {
          groupedByDate.push({ date, tasks: [item] })
        } else {
          groupedByDate[index].tasks.push(item)
        }
      })
      return groupedByDate
    }
  })

  async function toggleTaskSelection(task: TEditTask) {
    if (task.id && event.selectedTasks.includes(task.id)) {
      taskDone.value = false
      if (task) await event.changeTask(task, taskDone.value)
      event.selectedTasks = event.selectedTasks.filter(id => id !== task.id)
    } else {
      taskDone.value = true
      if (task) await event.changeTask(task, taskDone.value)
      if(task.id) event.selectedTasks.push(task.id)
    }
  }

  const isSelected = computed(() => {
    return (taskId: number) => event.selectedTasks.includes(taskId)
  })

  function getBusinessName(id: number) {
    const currentBusiness = allBusiness.filter(business => business.id === id)
    if(currentBusiness.length) {
      return currentBusiness[0].name
    }
  }

  onMounted(async () => {
    await event.getTasks()
    await business.getUserBusiness()
  })
</script>

<template>
  <div class="task-container">
    <div class="flex justify-between">
      <p class="task-title">{{ $t('my_task.tasks') }}</p>
      <div class="flex gap-8 flex-wrap" :class="{ 'justify-end': !checkScreen }">
        <div class="pills-content">
          <img :src="getIcon + 'done-task.png'" />
          <p @click="event.showModalReadyTask = !event.showModalReadyTask">{{ $t('my_task.completely_task') }}</p>
        </div>
        <Listbox as="div" v-model="selectedFilter">
          <div class="relative pills-content">
            <ListboxButton class="flex gap-4">
              <div class="flex items-center">
                <span class="block truncate">{{ selectedFilter.name || 'Фильтр' }}</span>
              </div>
              <div class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </ListboxButton>

            <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions
                  class="absolute left-0 top-12 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption as="template" v-for="type in filter" :key="type.id" :value="type" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ type.name }}</span>
                    </div>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <Listbox as="div" v-model="selectedTask">
          <div class="relative pills-content">
            <ListboxButton class="flex gap-4">
              <div class="flex items-center">
                <span class="block truncate">{{ selectedTask.name || 'Все задачи' }}</span>
              </div>
              <div class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </ListboxButton>

            <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions
                  class="absolute left-0 top-12 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption as="template" v-for="type in tasks" :key="type.id" :value="type" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ type.name }}</span>
                    </div>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </div>
    <hr >
    <div class="add-task">
      <p @click="event.addTaskModal(currentEvent.id, currentEvent.date)">+ Добавить задачи</p>
    </div>
    <div>
      <hr />
      <div v-for="(group, index) in sortTasks" :key="index" class="flex flex-col gap-4 my-8">
        <div class="flex gap-2 items-center">
          <p class="task-date">{{ group.date }}</p>
          <hr class="w-full" >
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex gap-4" v-for="(task, index) in group.tasks" :key="index">
            <div class="flex gap-4 items-center">
              <img
                  @click="toggleTaskSelection(task)"
                  :src="(task.is_done || isSelected(task.id)) ? getIcon + 'list-event.png' : getIcon + 'empty-selected.png'"
              />
              <div @click="event.showEditTaskModal(group.date, task)" class="flex flex-col">
                <p class="task-name" :class="{ 'selected': task.is_done }">{{ task.name }}</p>
                <p v-if="!getBusinessName(task.business)" class="selected-vendor" :class="{ 'selected': task.is_done }">Вендор пока не выбран</p>
                <p v-if="getBusinessName(task.business)" class="selected-vendor" :class="{ 'selected': task.is_done }">{{ getBusinessName(task.business) }}</p>
              </div>
              <p :class="{ 'selected': task.is_done }">{{ task.task_type }}</p>
              <p :class="{ 'selected': task.is_done }">{{ task.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ReadyTasksModal :currentEvent="currentEvent" />
  <AddNewEvent v-if="event.showCreateEventModal" />
  <ChooseVendorModal v-if="event.chooseVendor" />
</template>

<style scoped>
  .selected {
    opacity: 0.5;
  }
  .selected-vendor {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .task-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .task-date {
    color: #B9BDCA;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .task-container {
    display: flex;
    padding: 32px;
    flex-direction: column;
    gap: 32px;
    border-radius: 16px;
    background:#FFF;
    min-width: 1200px;
    max-height: 100vh;
    overflow-x: scroll;
  }
  .task-container::-webkit-scrollbar {
    width: 0;
  }
  .task-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
  .pills-content {
    display: flex;
    padding: 16px 16px 16px 24px;
    align-items: flex-start;
    gap: 15px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .pills-content p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .pills-content span {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .pills-content button {
    min-width: 200px;
  }
  .add-task {
    display: flex;
    padding: 16px 32px 16px 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    background: #F9F9F9;
  }
  .add-task p {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .add-task {
      max-width: 318px;
    }
    .task-container {
      min-width: min-content;
      padding: 32px 16px;
      margin: 20px;
    }
  }
</style>