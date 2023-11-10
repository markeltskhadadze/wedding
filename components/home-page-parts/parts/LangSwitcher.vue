<script setup lang="ts">
  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
  import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  import {onMounted, Ref, ref} from 'vue'
  import { getImage } from '~/mixins/get-icon'
  import { TLang } from "~/types"

  const language = [
    {
      id: 1,
      name: 'Русский',
      code: 'ru',
      img: 'russ-lang.png'
    },
    {
      id: 2,
      name: 'Узбекский',
      code: 'uz',
      img: 'uz-lang.png'
    },
    {
      id: 3,
      name: 'Английский',
      code: 'en',
      img: 'en-lang.png'
    }
  ]

  const selectedLanguage = ref(language[0])
  const { getIcon } = getImage.setup()
  const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="flex flex-col gap-2">
    <Listbox as="div" v-model="selectedLanguage">
      <div class="relative pills-content">
        <ListboxButton class="flex gap-4">
          <div class="flex items-center">
            <div class="flex items-center gap-2">
              <img :src="getIcon + selectedLanguage.img">
              <span class="block truncate">{{ selectedLanguage.name }}</span>
            </div>
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
            <ListboxOption as="template" v-for="type in language" :key="type.id" :value="type" v-slot="{ active, selected }">
              <li :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                <div class="flex items-center">
                  <img :src="getIcon + type.img">
                  <NuxtLink :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']" :to="switchLocalePath(type.code)">{{ type.name }}</NuxtLink>
                </div>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<style scoped>
  .pills-content {
    display: flex;
    padding: 16px 32px 16px 24px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 12px;
    background: #F9F9F9;
  }
  @media (max-width: 600px) {
    .pills-content {
      max-width: 116px;
    }
  }
</style>
