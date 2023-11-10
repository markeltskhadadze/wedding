<script setup lang="ts">
  import { onBeforeUnmount } from 'vue'
  import {
    Dialog,
    DialogPanel,
    Listbox, ListboxButton,
    ListboxOption,
    ListboxOptions,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import { eventsInfo } from '~/stores/events'
  import { registrationModal } from '~/stores/registration-modal'
  import { getImage } from '~/mixins/get-icon'
  import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  import { screen } from '~/mixins/check-screen'
  import { homePageData } from "~/stores/home-page"

  const event = eventsInfo()
  const homeData = homePageData()
  const registration  = registrationModal()
  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()

  onBeforeUnmount(() => {
    event.showCreateEventModal = false
    event.name = ''
    registration.date = new Date()
    event.eventDate = new Date()
    event.modalStep = true
    homeData.selectedPlacesId.length = 0
  })
</script>

<template>
  <TransitionRoot as="template" :show="event.showCreateEventModal">
    <Dialog as="div" class="relative z-10" @close="event.showCreateEventModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
            class="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0"
            :class="{ 'items-end': checkScreen, 'items-center': !checkScreen }"
        >
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 create-event-modal">
                <div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-10">
                    <div class="flex flex-col gap-2">
                      <p class="modal-title">{{ event.getTitleModal }}</p>
                      <p class="modal-description">{{ $t('add_events.modal_desc') }}</p>
                    </div>
                    <div v-if="event.modalStep" class="flex flex-wrap flex-col gap-4">
                      <input class="event-form" v-model="event.name" type="text" :placeholder="$t('add_events.event_name')" />
                      <p v-if="event.nameError" class="error-text">Обязательное поле</p>
                      <div class="relative">
                        <input disabled :value="registration.getDate" class="event-form w-full" type="text" />
                        <img
                            :src="getIcon + 'calendar-icon.png'"
                            class="calendar-icon"
                            @click="registration.showCalendar = !registration.showCalendar"
                        />
                      </div>
                      <VDatePicker
                          :disabled-dates="registration.disabledDates"
                          v-model="registration.date"
                          title-position="left"
                          color="red"
                          v-if="registration.showCalendar"
                      />
                    </div>
                    <div v-if="!event.modalStep" class="flex flex-wrap flex-col gap-4">
                      <input class="event-form" type="text" v-model="event.taskName" :placeholder="$t('add_events.event_task')" />
                      <div class="relative">
                        <input disabled :value="event.getDateForTasks" class="event-form w-full test" type="text" />
                        <img
                            :src="getIcon + 'calendar-icon.png'"
                            class="calendar-icon"
                            @click="registration.showCalendar = !registration.showCalendar"
                        />
                      </div>
                      <div class="calendar-position">
                        <VDatePicker
                            :disabled-dates="registration.disabledDates"
                            v-model="event.eventDate"
                            title-position="left"
                            color="red"
                            v-if="registration.showCalendar"
                        />
                      </div>
                      <Listbox as="div" v-model="event.selectedTaskType">
                        <div class="relative pills-content">
                          <ListboxButton class="flex gap-4">
                            <div class="flex items-center">
                              <span class="block truncate">{{ event.selectedTaskType.name || 'Выберите тип задачу' }}</span>
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
                              <ListboxOption as="template" v-for="type in event.taskType" :key="type.id" :value="type" v-slot="{ active, selected }">
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
                      <div class="select-vendor" @click="event.selectVendor">
                        <div class="flex flex-col gap-1">
                          <p class="choose-vendor">{{ $t('add_events.select_vendors') }}</p>
                          <p v-if="!homeData.selectedName" class="empty-vendor">{{ $t('add_events.vendor_is_empty') }}</p>
                          <p v-if="homeData.selectedName" class="empty-vendor">{{ homeData.selectedName }}</p>
                        </div>
                        <img :src="getIcon + 'vendor-arrow.png'">
                      </div>
                      <input class="event-form" type="text" v-model="event.description" :placeholder="$t('add_events.note')" />
                    </div>
                    <button v-if="!event.mode" class="create-event" @click="event.createEvent">{{ $t('add_events.create') }}</button>
                    <button v-if="event.mode === 'editTask'" class="create-event" @click="event.editTask">Сохранение изменений</button>
                    <button v-if="event.mode === 'addTask'" class="create-event" @click="event.addNewTask">{{ $t('add_events.create') }}</button>
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

<style>
  .vc-header .vc-title {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .vc-day-content {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .vc-weekday {
    color: #49516F;
    text-align: center;
    font-family: Geologica;
    font-size: 11px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .vc-container .vc-weekday-1, .vc-container .vc-weekday-7 {
    color: #FF3838;
    text-align: center;
    font-family: 'Geologica';
    font-size: 13.44px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
</style>

<style scoped>
  .error-text {
    font-size: 12px;
    color: #ff385c;
    font-weight: 800;
  }
  .calendar-position {
    position: fixed;
    left: 30%;
    bottom: 18%;
    z-index: 50;
  }
  .select-vendor {
    display: flex;
    padding: 16px 16px 16px 24px;
    justify-content: space-between;
    align-items: center;
    border-radius: 14px;
    background: rgba(255, 56, 92, 0.10);
    cursor: pointer;
  }
  .choose-vendor {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .empty-vendor {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
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
  .create-event-modal {
    padding: 64px;
  }
  .event-form {
    min-width: 420px;
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
    color:  #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .create-event {
    max-width: 420px;
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
  .modal-title {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
  }
  .modal-description {
    color: rgba(73, 81, 111, 0.50);
    text-align: center;
    font-family: Geologica;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .calendar-icon {
    position: absolute;
    right: 10px;
    top: 15px;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .event-form {
      min-width: 318px;
    }
    .create-event-modal {
      padding: 32px 16px;
    }
  }
</style>