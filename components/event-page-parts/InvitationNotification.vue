<script setup lang="ts">
  import { reactive, toRaw } from 'vue'
  import { getImage } from '~/mixins/get-icon'
  import { eventsInfo } from '~/stores/events'

  const { getIcon } = getImage.setup()
  const event = eventsInfo()
  const myInvitation = reactive(toRaw(event.myInvitation))
  const allInvitation = reactive(toRaw(event.allInvitation))
</script>

<template>
  <div v-if="myInvitation.length">
    <div v-for="(invite, index) in myInvitation" :key="index" class="notification-container">
      <div class="w-full flex justify-end">
        <img @click="event.showNotification = !event.showNotification" :src="getIcon + 'close-btn.png'" class="close-image" />
      </div>
      <p class="invite-text">
        {{ invite.inviter.full_name }} приглашает вас на мероприятие под названием "{{ invite.event.name }}"
      </p>
      <div class="btn-container">
        <button class="cancel-invite" @click="event.cancelInvite(invite.id, invite.can_change)">Отмена</button>
        <button class="apply-invite" @click="event.acceptInvite(invite.id)">Получение</button>
      </div>
    </div>
  </div>
  <div v-if="allInvitation.length">
    <div v-for="(invite, index) in allInvitation" :key="index" class="notification-container">
      <div class="w-full flex justify-end">
        <img @click="event.showNotification = !event.showNotification" :src="getIcon + 'close-btn.png'" class="close-image" />
      </div>
      <div class="flex gap-4">
        <img :src="getIcon + 'list-event.png'" class="close-image" />
        <p class="invite-text">
          {{ invite.invited_user.full_name }} Принял ваше предложение
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .close-image {
    cursor: pointer;
  }
  .cancel-invite {
    padding: 16px 32px;
    border-radius: 12px;
    border: 1px solid #FF385C;
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
  }
  .apply-invite {
    padding: 16px 32px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    color: #FFF;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
  }
  .btn-container {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .invite-text {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .notification-container {
    position: absolute;
    right: 6%;
    top: 80%;
    z-index: 99;
    display: inline-flex;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 14px;
    background: #FFF;
    box-shadow: 0 13px 23px 0  rgba(0, 0, 0, 0.06);
    max-width: 420px;
  }

  @media (max-width: 600px) {
    .notification-container {
      right: 2%;
    }
  }
</style>