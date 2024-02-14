import {defineStore} from 'pinia'
import {computed, reactive, ref, Ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {authInfo} from '~/stores/auth'
import {registrationModal} from '~/stores/registration-modal'
import {homePageData} from "~/stores/home-page"
import {
    TAllTasksResult,
    TEditTask,
    TEvents,
    TFuncTask,
    TInvitation,
    TInvitedUser,
    TInvitedUserResult,
    TReadyEvents
} from "~/types"

export const eventsInfo = defineStore('eventsInfo', () => {
    const auth = authInfo()
    const registration  = registrationModal()
    const showCreateEventModal: Ref<boolean> = ref(false)
    const modalStep: Ref<boolean> = ref(true)
    const invitationModal: Ref<boolean> = ref(false)
    const events = reactive<TEvents[]>([])
    const chooseVendor: Ref<boolean> = ref(false)
    const selectedTaskType: Ref<string> = ref('')
    const phoneNumber: Ref<string> = ref('')
    const taskName: Ref<string> = ref('')
    const name: Ref<string> = ref('')
    const description: Ref<string> = ref('')
    const eventDate = ref(new Date())
    const currentEventId: Ref<number> = ref(0)
    const currentTaskDate: Ref<string> = ref('')
    const currentTaskId: Ref<number> = ref(0)
    const showTaskList: Ref<boolean> = ref(false)
    const showNotification: Ref<boolean> = ref(false)
    const editInvidation: Ref<boolean> = ref(false)
    const deleteInvitationModal: Ref<boolean> = ref(false)
    const nameError: Ref<boolean> = ref(false)
    const isEdit: Ref<boolean> = ref(true)
    let selectedTasks: number[] = reactive([])
    const userName: Ref<string> = ref('')
    const searchValue: Ref<string> = ref('')
    const mode: Ref<string> = ref('')
    const inviteId: Ref<number> = ref(0)
    const showModalReadyTask: Ref<boolean> = ref(false)
    const home = homePageData()
    const myInvitation = reactive<TInvitation[]>([])
    const allInvitation = reactive<TInvitedUserResult[]>([])
    const readyTasks = reactive<TReadyEvents[]>([])
    const taskList = reactive<TAllTasksResult[]>([])
    // const newTaskData = reactive<TEditTask>([])
    const taskType = [
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
    const editTaskData = ref<TEditTask>({
        _id: 0,
        date_time: '',
        name: '',
        task_type: 0,
        event: 0,
        business: 0,
        is_done: false,
        description: ''
    })

    const getTitleModal = computed(() => {
        const { t } = useI18n()
        if (modalStep.value) {
            return t('add_events.modal_title')
        } else {
            return t('add_events.modal_title_step_2')
        }
    })

    watch(() => eventDate.value, (newOpen) => {
        if (newOpen) {
            registration.showCalendar = false
        }
    })

    async function createEvent() {
        if (name.value) {
            try {
                await $fetch('http://localhost:3001/api/events/', {
                    method: 'POST',
                    headers: {
                        Authorization: auth.token,
                    },
                    body: {
                        name: name.value,
                        date: registration.date
                    }
                })
                window.location.reload()
            } catch (e) {
                console.log(e)
            }
        } else {
            nameError.value = true
        }
    }

    function selectVendor() {
        chooseVendor.value = true
    }

    async function getTasks() {
        try {
            const response = await $fetch<TAllTasksResult[]>( 'http://localhost:3001/api/tasks/', {
                method: 'GET',
                headers: {
                    Authorization: auth.token
                }
            })
            if (!taskList.length) taskList.push(...response as TAllTasksResult[])
        } catch (e) {
            console.log(e)
        }
    }

    async function getEvents() {
        try {
            const response = await $fetch<TEvents[]>( 'http://localhost:3001/api/events/', {
                method: 'GET',
                headers: {
                    Authorization: auth.token
                }
            })
            if (!events.length) events.push(...response as TEvents[])
        } catch (e) {
            console.log(e)
        }
    }

    async function getReadyTasks() {
        try {
            const response = await $fetch<TReadyEvents[]>( 'https://api.talklif.uz/v1/task/ready/', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            if (!readyTasks.length) readyTasks.push(...response as TReadyEvents[])
        } catch (e) {
            console.log(e)
        }
    }

    function showInvitationModal(eventId: number) {
        currentEventId.value = eventId
        invitationModal.value = !invitationModal.value
    }

    function showChangeInvitationModal(name: string | undefined, id: number | undefined) {
        if(name) userName.value = name
        if(id) inviteId.value = id
        editInvidation.value = !editInvidation.value
    }

    function openDeleteModal() {
        editInvidation.value = !editInvidation.value
        deleteInvitationModal.value = !deleteInvitationModal.value
    }

    async function addReadyTasks(eventId: number, taskId: number[]) {
        try {
            const response = await $fetch('https://api.talklif.uz/v1/task/create_task_with_suggestion/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: {
                    event: eventId,
                    tasks: taskId
                }
            })
            taskList.push(response as TAllTasksResult)
            showModalReadyTask.value = false
        } catch (e) {
            console.log(e)
        }
    }

    async function sendInvitation() {
        try {
            const response = await $fetch('https://api.talklif.uz/v1/invitation/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: {
                    phone_number: phoneNumber.value.replace(/[\s-]/g, ''),
                    event: currentEventId.value,
                    can_change: isEdit.value
                }
            })
            taskList.push(response as TAllTasksResult)
            home.showNotification = true
            invitationModal.value = false
        } catch (e) {
            console.log(e)
        }
    }

    async function getInvitation() {
        try {
            const response = await $fetch<TInvitation[]>('https://api.talklif.uz/v1/invitation/my_invitations', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token
                }
            })
            if(!myInvitation.length) myInvitation.push(...response as TInvitation[])
        } catch (e) {
            console.log(e)
        }
    }

    async function getAllInvitation() {
        try {
            const response = await $fetch<TInvitedUser>('https://api.talklif.uz/v1/invitation/', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            if(!allInvitation.length) allInvitation.push(...response.results as TInvitedUserResult[])
        } catch (e) {
            console.log(e)
        }
    }

    async function acceptInvite(id: number) {
        try {
            await $fetch('https://api.talklif.uz/v1/invitation/accept_invitation/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: {
                    invitation: id
                }
            })
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    async function cancelInvite(id: number, can_change: boolean) {
        try {
            await $fetch('https://api.talklif.uz/v1/invitation/deny_invitation/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: {
                    invitation: id,
                    can_change: can_change
                }
            })
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    async function deleteInvitation() {
        try {
            const response = await $fetch(`https://api.talklif.uz/v1/invitation/${inviteId.value}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + auth.token
                }
            })
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    function showEditTaskModal(
        date: string,
        task: TFuncTask
    ) {
        if(task._id) currentTaskId.value = task._id
        taskName.value = task.name
        eventDate.value = new Date(date)
        editTaskData.value = {
            date_time: date,
            _id: task._id,
            name: task.name,
            task_type: task.task_type,
            event: task.event,
            business: task.business,
            is_done: task.is_done,
            description: description.value
        }
        modalStep.value = false
        showCreateEventModal.value = true
        mode.value = 'editTask'
    }

    function addTaskModal(id: number, date: string) {
        currentEventId.value = id
        currentTaskDate.value = date
        modalStep.value = false
        showCreateEventModal.value = true
        mode.value = 'addTask'
    }

    async function addNewTask() {
        try {
            const taskData: TEditTask = {
                event: currentEventId.value,
                name: taskName.value,
                date_time: eventDate.value.toISOString().slice(0, 19),
                is_done: false
            }
            if(home.currentBusinessId) taskData.business = home.currentBusinessId
            if(description.value) taskData.description = description.value
            const response = await $fetch<TEditTask>('http://localhost:3001/api/tasks/', {
                method: 'POST',
                headers: {
                    Authorization: auth.token
                },
                body: taskData
            })
            modalStep.value = true
            showCreateEventModal.value = false
            registration.showCalendar = false
            // @ts-ignore
            taskList.push(response as TEditTask)
        } catch (e) {
            console.log(e)
        }
    }

    async function editTask() {
        try {
            if(taskName.value) editTaskData.value.name = taskName.value
            if(eventDate.value) editTaskData.value.date_time = eventDate.value.toISOString().slice(0, 19)
            if(description.value) editTaskData.value.description = description.value
            if(home.currentBusinessId) editTaskData.value.business = home.currentBusinessId
            const response = await $fetch<TEditTask>(`http://localhost:3001/api/tasks/${currentTaskId.value}/`, {
                method: 'PUT',
                headers: {
                    Authorization: auth.token
                },
                body: editTaskData.value
            })
            modalStep.value = true
            showCreateEventModal.value = false
            registration.showCalendar = false
            console.log(taskList)
            const taskIndex = taskList.findIndex(task => task._id === currentTaskId.value)
            if (taskIndex !== -1) {
                // @ts-ignore
                taskList[taskIndex] = response
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function changeTask(task: TEditTask, taskDone: boolean) {
        try {
            const response = await $fetch<TEditTask>(`http://localhost:3001/api/tasks/${task._id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: auth.token
                },
                body: {
                    event: task.event,
                    name: task.name,
                    is_done: taskDone
                }
            })
            const taskIndex = taskList.findIndex(existingTask => existingTask._id === task._id)
            if (taskIndex !== -1) {
                // @ts-ignore
                taskList[taskIndex] = response
            }
        } catch (e) {
            console.log(e)
        }
    }

    function showAddEventModal() {
        showCreateEventModal.value = true
    }

    const getDateForTasks = computed(() => {
        const inputDate = new Date(eventDate.value)

        const day = String(inputDate.getDate()).padStart(2, '0')
        const month = String(inputDate.getMonth() + 1).padStart(2, '0')
        const year = inputDate.getFullYear()

        return `${day}.${month}.${year}`
    })

    return {
        readyTasks,
        taskList,
        mode,
        showCreateEventModal,
        modalStep,
        currentEventId,
        chooseVendor,
        nameError,
        taskName,
        selectedTaskType,
        taskType,
        description,
        userName,
        events,
        deleteInvitationModal,
        name,
        searchValue,
        editInvidation,
        getTitleModal,
        invitationModal,
        phoneNumber,
        myInvitation,
        allInvitation,
        showNotification,
        isEdit,
        eventDate,
        showTaskList,
        selectedTasks,
        showModalReadyTask,
        showEditTaskModal,
        showAddEventModal,
        addTaskModal,
        getDateForTasks,
        editTask,
        addNewTask,
        getAllInvitation,
        changeTask,
        acceptInvite,
        openDeleteModal,
        deleteInvitation,
        cancelInvite,
        showChangeInvitationModal,
        sendInvitation,
        getInvitation,
        getReadyTasks,
        showInvitationModal,
        addReadyTasks,
        getEvents,
        createEvent,
        selectVendor,
        getTasks
    }
})