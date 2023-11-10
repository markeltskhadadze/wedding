<script setup lang="ts">
  import {Ref, ref, computed, onMounted, toRaw, reactive, PropType} from 'vue'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { eventsInfo } from '~/stores/events'
  import {TEvents, TReadyEvents, TSuggestedTasks} from '~/types'
  import { getImage } from '~/mixins/get-icon'
  import { screen } from '~/mixins/check-screen'

  const props = defineProps({
    currentEvent: {
      type: Object as PropType<TEvents>,
      required: true
    }
  })

  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const eventsData = eventsInfo()
  const events: TReadyEvents[] = reactive(toRaw(eventsData.readyTasks))
  const eventList: TEvents[] = reactive(toRaw(eventsData.taskList))
  const selectedTask: Ref<string> = ref('')
  let tasks = reactive<TEvents[]>([])
  const modalStep: Ref<boolean> = ref(true)

  function selectTask(event: TReadyEvents) {
    selectedTask.value = event.name
    if(!tasks.length) tasks.push(...event.suggested_tasks as TSuggestedTasks[])
    eventsData.selectedTasks = tasks.map(task => task.id)
    modalStep.value = false
  }

  function goBack() {
    modalStep.value = true
    tasks = []
  }

  function addTasks() {
    const taskId = tasks.map(task => task.id)
    eventsData.addReadyTasks(props.currentEvent.id, taskId)
  }

  function toggleTaskSelection(taskId: number) {
    if (eventsData.selectedTasks.includes(taskId)) {
      eventsData.selectedTasks = eventsData.selectedTasks.filter(id => id !== taskId)
    } else {
      eventsData.selectedTasks.push(taskId)
    }
  }

  const isSelected = computed(() => {
    return (taskId: number) => eventsData.selectedTasks.includes(taskId)
  })

  const getTitleModal = computed(() => {
    return modalStep.value ? 'Готовая задача' : selectedTask.value
  })

  onMounted(async() => {
    await eventsData.getReadyTasks()
  })
</script>

<template>
  <TransitionRoot as="template" :show="eventsData.showModalReadyTask">
    <Dialog as="div" class="relative z-10" >
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
            class="flex min-h-full justify-center text-center sm:items-center sm:p-0"
            :class="{ 'items-end p-4': checkScreen, 'items-center pt-24': !checkScreen, }"
        >
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                :class="{ 'w-7/12': checkScreen, 'w-full': !checkScreen }"
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
            >
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ready-tasks-modal">
                <div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-8">
                    <div class="flex justify-between">
                      <p class="modal-title">{{ getTitleModal }}</p>
                      <img @click="eventsData.showModalReadyTask = !eventsData.showModalReadyTask" :src="getIcon + 'close-btn.png'" class="close-btn" />
                    </div>
                    <hr />
                    <div v-if="modalStep" class="flex flex-wrap gap-8">
                      <div v-for="(event, index) in events" :key="index" class="ready-task">
                        <p @click="selectTask(event)">{{ event.name }}</p>
                      </div>
                    </div>
                    <div v-if="!modalStep" class="flex flex-wrap flex-col gap-8">
                      <div v-for="(task, index) in tasks" :key="index" class="flex gap-4 items-center">
                        <div @click="toggleTaskSelection(task.id)" class="flex gap-4 items-center">
                          <img :src="isSelected(task.id) ? getIcon + 'list-event.png' : getIcon + 'empty-selected.png'" />
                          <p>{{ task.name }}</p>
                        </div>
                      </div>
                      <hr />
                      <div class="flex justify-end gap-4" :class="{ 'justify-between': !checkScreen }">
                        <button class="go-back" @click="goBack">{{ $t('register_modal.back_modal') }}</button>
                        <button class="select-tasks" @click="addTasks">{{ $t('register_modal.select_profile') }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
  .close-btn {
    max-width: 24px;
    max-height: 24px;
    cursor: pointer;
  }
  .ready-tasks-modal {
    display: inline-flex;
    padding: 64px;
    flex-direction: column;
    gap: 32px;
    border-radius: 24px;
    background: #FFF;
    width: 100%;
  }
  .ready-task {
    padding: 32px 0;
    border-radius: 16px;
    background: #F7F7F7;
    flex: 0 1 30%;
    cursor: pointer;
  }
  .ready-task:hover {
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
  }
  .ready-task p {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .ready-task p:hover {
    color: #ffffff;
  }
  .modal-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
  .go-back {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 16px 32px;
    border-radius: 12px;
    background: #F9F9F9;
  }
  .select-tasks {
    padding: 16px 32px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    color: #FFF;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  @media (max-width: 900px) {
    .ready-tasks-modal {
      padding: 24px 20px;
      gap: 32px;
      height: 100vh;
    }
    .ready-task {
      flex: 0 1 44%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .go-back {
      flex: 0 1 45%;
    }
    .select-tasks {
      flex: 0 1 45%;
    }
  }
</style>