<script setup lang="ts">
  import { getImage } from '~/mixins/get-icon'
  import { eventsInfo } from "~/stores/events"

  const { getIcon } = getImage.setup()
  const event = eventsInfo()

  function showTask() {
    event.showTaskList = true
  }
</script>

<template>
  <div class="flex flex-wrap gap-8 task-container">
    <div class="select-task" @click="showTask">
      <img :src="getIcon + 'tasks-icon.png'" />
      <p class="select-tasks">Задачи</p>
    </div>
    <div class="select-task" style="opacity: 0.5;">
      <img :src="getIcon + 'budget-icon.png'" />
      <p class="select-budget">Планировшик бюджета</p>
    </div>
    <div class="select-task" style="opacity: 0.5;">
      <img :src="getIcon + 'invite-icon.png'" />
      <p class="select-invite">Приглашения</p>
    </div>
    <div class="select-task" style="opacity: 0.5;">
      <img :src="getIcon + 'tables-icon.png'" />
      <p class="select-tables">Столы</p>
    </div>
    <div class="select-task" style="opacity: 0.5;">
      <img :src="getIcon + 'your-web-site.png'" />
      <p class="select-web">Вебсайт вашей свадьбы</p>
    </div>
  </div>
</template>

<style scoped>
  .select-web {
    color: #27AE60;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .select-tables {
    color: #BB6BD9;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .select-budget {
    color: #F2C94C;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .select-invite {
    color: #2D9CDB;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .select-task {
    display: flex;
    min-width: 258px;
    min-height: 172px;
    padding: 24px 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0 4px 64px 0 rgba(0, 0, 0, 0.04);
    flex: 0 1 20%;
    cursor: pointer;
  }
  .select-tasks {
    color: #FF385C;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .select-task img {
    min-width: 32px;
    min-height: 32px;
  }
  .task-container {
    border-radius: 16px;
    border: 1px solid #F1F1F1;
  }
  @media (max-width: 900px) {
    .select-task {
      min-width: auto;
      flex: 0 1 47%;
    }
    .task-container {
      padding: 0 20px;
      gap: 20px;
      border: 0;
    }
  }
</style>