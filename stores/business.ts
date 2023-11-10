import { reactive, ref, Ref, toRaw, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { getHeader } from '~/mixins/header'
import {
    TBusinessAll,
    TBusinessImage,
    TBusinessResult,
    TCity,
    TFavoriteResults,
    TImageBusiness,
    TImageId,
    TRegion
} from '~/types'
import { authInfo } from '~/stores/auth'
import { homePageData } from "~/stores/home-page"

export const businessInfo = defineStore('businessInfo', () => {
    const auth = authInfo()
    const businessName: Ref<string> = ref('')
    const home = homePageData()
    const currentBusinessId: Ref<string> = ref('')
    const description: Ref<string> = ref('')
    const facebook: Ref<string> = ref('')
    const telegram: Ref<string> = ref('')
    const instagram: Ref<string> = ref('')
    let lat: Ref<number> = ref(0)
    let lon: Ref<number> = ref(0)
    const address: Ref<string> = ref('')
    const phoneNumber1: Ref<string> = ref('')
    const phoneNumber2: Ref<string> = ref('')
    const mainBusinessImage: Ref<number> = ref(0)
    const selectMainImages = reactive([])
    const minValue: Ref<number> = ref(0)
    const maxValue: Ref<number> = ref(0)
    const price: Ref<number> = ref(0)
    const images = reactive([])
    const categoryId: Ref<number> = ref(0)
    let businessAvatar = reactive<TBusinessImage[]>([])
    let businessAvatars = reactive<TImageBusiness[]>([])
    let uploadedAvatar = reactive<TImageBusiness[]>([])
    const userBusiness = reactive<TBusinessResult[]>([])
    let readyBusiness = reactive<TBusinessResult[]>([])
    let waitBusiness = reactive<TBusinessResult[]>([])
    const region = reactive<TRegion[]>([])
    const selectedRegion = ref<TCity>({
        id: 0,
        name: ''
    })
    const selectedCity: Ref<string> = ref('')
    const approvedBusiness: Ref<boolean> = ref(false)
    const waitingBusiness: Ref<boolean> = ref(false)
    const businessNameError: Ref<boolean> = ref(false)
    const selectedCategoryError: Ref<boolean> = ref(false)
    const selectedRegionError: Ref<boolean> = ref(false)
    const showAddBusiness: Ref<boolean> = ref(false)
    const editEventMode: Ref<boolean> = ref(false)
    const isLoading: Ref<boolean> = ref(false)
    const imgIdIsMain = reactive([])
    const apiKey = 'AIzaSyBxWwsmISHb_3CokPL0N5hoyQWT-moRB_4'
    const selectedCategory = ref<TRegion>({
        id: 0,
        name: '',
        districts: [
            {
                id: 0,
                name: ''
            }
        ]
    })
    const district: Ref<number> = ref(0)
    async function getUserBusiness() {
        try {
            const response = await $fetch<TBusinessResult[]>( 'https://node-and-mongo-project.herokuapp.com/api/user-business', {
                method: 'GET',
                headers: {
                    Authorization: auth.token
                }
            })
            if(!userBusiness.length) userBusiness.push(...response as TBusinessResult[])
            if(!readyBusiness.length) readyBusiness.push(...userBusiness.filter(business => business.status === 'active'))
            if(!waitBusiness.length) waitBusiness.push(...userBusiness.filter(business => business.status === 'in_process'))
            isLoading.value = true
            approvedBusiness.value = true
        } catch (e) {
            isLoading.value = true
            console.log(e)
        }
    }

    async function addNewBusiness() {
        if(businessName.value) {
            try {
                const businessData: TBusinessResult = {
                    name: businessName.value,
                    description: description.value,
                    price: price.value,
                    images: []
                }
                if (businessAvatar.length) {
                    const image = {
                        image: businessAvatar[0].id,
                        is_main: true
                    }
                    // @ts-ignore
                    businessData.images.push(image)
                }
                if(district) businessData.district = selectedRegion.value.id
                if(facebook) businessData.facebook = facebook.value
                if(instagram) businessData.instagram = instagram.value
                if(address) businessData.address = address.value
                if(telegram) businessData.telegram = telegram.value
                if(phoneNumber1) businessData.phone_number1 = phoneNumber1.value.replace(/[\s-]/g, '')
                if(phoneNumber2) businessData.phone_number2 = phoneNumber2.value.replace(/[\s-]/g, '')
                await $fetch( 'https://node-and-mongo-project.herokuapp.com/api/add-business', {
                    method: 'POST',
                    headers: {
                        Authorization: auth.token
                    },
                    body: businessData
                })
                businessNameError.value = false
                // window.location.reload()
            } catch (e) {
                console.log(e)
            }
        } else {
            businessNameError.value = true
            selectedCategoryError.value = true
            selectedRegionError.value = true
        }
    }

    async function businessImages(e: any) {
        let uploadedFiles = e.target.files
        if (!images.length) {
            for( let i = 0; i < uploadedFiles.length; i++ ) {
                // @ts-ignore
                images.push( uploadedFiles[i] )
            }
        } else {
            images.length = 0
            for( let i = 0; i < uploadedFiles.length; i++ ) {
                // @ts-ignore
                images.push( uploadedFiles[i] )
            }
            console.log(images)
        }
        if (images.length) {
            let formData = new FormData()
            formData.append('file', images[0])
            try {
                const response = await $fetch<TImageId>('https://api.talklif.uz/v1/document/file/', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + auth.token
                    },
                    body: formData
                })
                if (!businessAvatar.length) {
                    businessAvatar.push(response as TBusinessImage)
                } else {
                    businessAvatar.splice(1, 0)
                    businessAvatar.push(response as TBusinessImage)
                }
                try {
                    const response = await $fetch<TImageId>('https://api.talklif.uz/v1/business/add_image/', {
                        method: 'POST',
                        headers: {
                            Authorization: "Bearer " + auth.token
                        },
                        body: {
                            business: currentBusinessId.value,
                            image: businessAvatar[0].id
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    async function addBusinessImages(e: any) {
        let uploadedFiles = e.target.files
        if (!images.length) {
            for( let i = 0; i < uploadedFiles.length; i++ ) {
                // @ts-ignore
                images.push( uploadedFiles[i] )
            }
        } else {
            images.length = 0
            for( let i = 0; i < uploadedFiles.length; i++ ) {
                // @ts-ignore
                images.push( uploadedFiles[i] )
            }
        }
        if (images.length) {
            let formData = new FormData()
            formData.append('file', images[0])
            formData.append('business', currentBusinessId.value)
            try {
                const response = await $fetch<TImageId>('https://api.talklif.uz/v1/document/file/', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + auth.token
                    },
                    body: formData
                })
                // if (!businessAvatar.length) {
                //     businessAvatar.push(response as TBusinessImage)
                // } else {
                //     businessAvatar.splice(1, 0)
                //     businessAvatar.push(response as TBusinessImage)
                // }
                businessAvatar.push(response as TBusinessImage)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const avatarSrc = computed(() => {
        if (!businessAvatar.length) {
            return []
        } else {
            const businessImages = toRaw(businessAvatar)
            return businessImages.map((image) => ({
                is_main: false,
                image: {
                    file: image.file,
                    id: image.id
                }
            }))
        }
    })

    const businessAvatarSrc = computed(() => {
        if (!businessAvatar.length) {
            return businessAvatars
        } else {
            const businessImages = toRaw(businessAvatar)
            return businessImages.map((image) => ({
                is_main: false,
                image: {
                    file: image.file,
                    id: image.id
                }
            }))
        }
    })

    async function getRegion() {
        try {
            const response = await $fetch<TRegion[]>('https://api.talklif.uz/v1/region', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                },
            })
            if(!region.length) region.push(...response as TRegion[])
        } catch (e) {
            console.log(e)
        }
    }

    function toggleTabsApproved() {
        if (!approvedBusiness.value) {
            approvedBusiness.value = true
            waitingBusiness.value = false
        }
    }

    function toggleTabsWaiting() {
        if (!waitingBusiness.value) {
            waitingBusiness.value = true
            approvedBusiness.value = false
        }
    }

    function addBusiness() {
        showAddBusiness.value = !showAddBusiness.value
        businessNameError.value = false
        selectedCategoryError.value = false
        selectedRegionError.value = false
        getGoogleMaps()
    }

    async function editBusiness(id: string) {
        currentBusinessId.value = id
        editEventMode.value = true
        showAddBusiness.value = !showAddBusiness.value
        try {
            const response = await $fetch<TBusinessResult>(`https://api.talklif.uz/v1/business/${currentBusinessId.value}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            if (response.name) businessName.value = response.name
            if (response.category) categoryId.value = response.category
            if (response.district) district.value = response.district
            if (response.min_value) minValue.value = response.min_value
            if (response.max_value) maxValue.value = response.max_value
            if (response.price) price.value = response.price
            if (response.description) description.value = response.description
            if (response.phone_number1) phoneNumber1.value = response.phone_number1
            if (response.phone_number2) phoneNumber2.value = response.phone_number2
            if (response.instagram) instagram.value = response.instagram
            if (response.facebook) facebook.value = response.facebook
            if (response.telegram) telegram.value = response.telegram
            if (response.latitude) lat.value = response.latitude
            if (response.longitude) lon.value = response.longitude
            if (response.address) address.value = response.address
            if (response.images && !businessAvatars.length) businessAvatars.push(...response.images)
            getGoogleMaps()
        } catch (e) {
            console.log(e)
        }
    }

    function getGoogleMaps() {
        const latValue = lat.value ? lat.value : 41.311081
        const lonValue = lon.value ? lon.value : 69.240562
        let map
        let marker: any
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        script.defer = true
        script.async = true
        script.onload = () => {
            const mapContainer = document.querySelector('.input-google')
            const mapOptions = {
                center: { lat: latValue, lng: lonValue },
                zoom: 10
            }
            // @ts-ignore
            map = new google.maps.Map(mapContainer, mapOptions)
            // @ts-ignore
            marker = new google.maps.Marker({
                position: { lat: latValue, lng: lonValue },
                map: map,
                draggable: true
            })
            // @ts-ignore
            google.maps.event.addListener(marker, 'dragend', (event: any) => {
                lat.value = event.latLng.lat()
                lon.value = event.latLng.lng()
            })
            // @ts-ignore
            google.maps.event.addListener(map, 'click', (event: any) => {
                marker.setPosition(event.latLng)
                lat.value = event.latLng.lat()
                lon.value = event.latLng.lng()
            })
        }

        document.head.appendChild(script)
    }

    async function changeBusiness() {
        try {
            const businessData: TBusinessResult = {
                name: businessName.value,
                category: categoryId.value,
                description: description.value,
                max_value: minValue.value,
                min_value: maxValue.value,
                price: price.value
            }
            if (businessAvatar.length) {
                const image = {
                    image: businessAvatar[0].id,
                    is_main: true
                }
                // @ts-ignore
                businessData.images.push(image)
            }
            if(district) businessData.district = selectedRegion.value.id
            if(facebook) businessData.facebook = facebook.value
            if(instagram) businessData.instagram = instagram.value
            if(telegram) businessData.telegram = telegram.value
            if(address) businessData.address = address.value
            if(lat) businessData.latitude = lat.value
            if(lon) businessData.longitude = lon.value
            if(phoneNumber1) businessData.phone_number1 = phoneNumber1.value.replace(/[\s-]/g, '')
            if(phoneNumber2) businessData.phone_number2 = phoneNumber2.value.replace(/[\s-]/g, '')
            const response = await $fetch<TBusinessResult>(`https://api.talklif.uz/v1/business/${currentBusinessId.value}/`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: businessData
            })
            if(mainBusinessImage.value) {
                try {
                    const response = await $fetch<TImageId>('https://api.talklif.uz/v1/business/main_image/', {
                        method: 'POST',
                        headers: {
                            Authorization: "Bearer " + auth.token
                        },
                        body: {
                            business_image: mainBusinessImage.value
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    function selectedMainImage(imageId: number) {
        mainBusinessImage.value = imageId
        if (!imgIdIsMain.length) {
            imgIdIsMain.push(imageId)
        } else {
            const index = imgIdIsMain.findIndex(id => id === imageId)
            imgIdIsMain.splice(index, 1)
        }
    }

    return {
        mainBusinessImage,
        userBusiness,
        businessNameError,
        selectedCategoryError,
        selectedRegionError,
        businessName,
        address,
        lat,
        lon,
        description,
        facebook,
        readyBusiness,
        waitBusiness,
        editEventMode,
        instagram,
        telegram,
        uploadedAvatar,
        currentBusinessId,
        phoneNumber1,
        phoneNumber2,
        minValue,
        maxValue,
        price,
        images,
        region,
        selectedRegion,
        selectedCity,
        showAddBusiness,
        approvedBusiness,
        selectedCategory,
        isLoading,
        waitingBusiness,
        selectMainImages,
        businessAvatar,
        businessAvatarSrc,
        imgIdIsMain,
        addBusinessImages,
        getUserBusiness,
        editBusiness,
        changeBusiness,
        addNewBusiness,
        businessImages,
        selectedMainImage,
        avatarSrc,
        getRegion,
        toggleTabsApproved,
        toggleTabsWaiting,
        addBusiness
    }
})