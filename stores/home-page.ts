import { defineStore } from 'pinia'
import {
    TBlogs,
    TBlogsResult,
    TBusiness,
    TBusinessInfo,
    TCategoties,
    TResults,
    TResultsBusiness
} from '~/types'
import { computed, ref, Ref, reactive, watch, toRaw } from 'vue'
import { blogInfo } from '~/stores/blog'
import { eventsInfo } from "~/stores/events"

export const homePageData = defineStore('homePageData', () => {
    const currentLang: Ref<string> = ref('')
    let categoryName: Ref<string> = ref('')
    const blog = blogInfo()
    const event = eventsInfo()
    const showNotification: Ref<boolean> = ref(false)
    const showApplyBusiness: Ref<boolean> = ref(false)
    const showVendorList: Ref<boolean> = ref(false)
    const showWarningModal: Ref<boolean> = ref(false)
    const selectedName: Ref<string> = ref('')
    const selectedSearchCategory: Ref<string> = ref('')
    const currentBusinessId: Ref<number> = ref(0)
    const price: Ref<string> = ref('')
    const selectedPlacesId: number[] = reactive([])
    const businessId: Ref<string | number> = ref('')
    const categories = reactive<TCategoties[]>([])
    const topPlaces = reactive<TResults[]>([])
    const businessByCategory = reactive<TResults[]>([])
    const apiKey = 'AIzaSyBxWwsmISHb_3CokPL0N5hoyQWT-moRB_4'
    let businessInfo = ref<TBusinessInfo>({
            _id: '',
            name: '',
            price: 0,
            rate: 0,
            address: '',
            phone_number1: '',
            phone_number2: '',
            description: '',
            instagram: '',
            telegram: '',
            facebook: '',
            longitude: 0,
            latitude: 0
        }
    )
    const blogs = reactive<TBlogsResult[]>([])

    watch(showNotification, (newOpen) => {
        if (newOpen) {
            setTimeout(() => {
                showNotification.value = false
            }, 1500)
        }
    })

    const filteredBlogList = computed(() => {
        const currentTag: string | null = blog.currentCategory
        let filteredBlogs = blogs
        if (currentTag !== 'Все') {
            filteredBlogs = blogs.filter(blog => {
                const filteredTags = blog.tags.filter(tag => tag.name === currentTag)
                return filteredTags.length > 0
            })
            return filteredBlogs
        }
        return filteredBlogs
    })
    async function getCategories( ){
        try {
            const response = await $fetch<TCategoties[]>( 'https://node-and-mongo-project.herokuapp.com/api/category/', {
                method: 'GET'
            })
            if(!categories.length) categories.push(...response)
        } catch (e) {
            console.log(e)
        }
    }

    async function getBlogs( ){
        try {
            const response = await $fetch<TBlogs>( 'https://api.talklif.uz/v1/public/blog/', {
                method: 'GET',
                headers: {
                    'Accept-Language': currentLang.value
                }
            })
            if(!blogs.length) blogs.push(...response.results as TBlogsResult[])
        } catch (e) {
            console.log(e)
        }
    }

    async function getBusiness(){
        try {
            const categoryFilter = businessId.value ? `?category=${businessId.value}` : ''
            function getSearchParam() {
                if (event.searchValue && businessId.value) {
                    return `&search=${event.searchValue}`
                } else if (event.searchValue && !businessId.value) {
                    return `?search=${event.searchValue}`
                } else {
                    return ''
                }
            }
            const searchValue = getSearchParam()
            if (categoryFilter || searchValue) {
                const response = await $fetch<TBusiness>( `https://api.talklif.uz/v1/public/business/${categoryFilter}${searchValue}`, {
                    method: 'GET',
                    headers: {
                        'Accept-Language': currentLang.value
                    }
                })
                topPlaces.splice(0, topPlaces.length)
                topPlaces.push(...response.results as TResultsBusiness[])
            } else {
                const response = await $fetch<TResultsBusiness[]>('https://node-and-mongo-project.herokuapp.com/api/business/', {
                    method: 'GET',
                    headers: {
                        'Accept-Language': currentLang.value
                    }
                })
                topPlaces.splice(0, topPlaces.length)
                topPlaces.push(...response as TResultsBusiness[])
            }
        } catch (e) {
            console.log(e)
        }
    }

    function getGoogleMaps() {
        const latValue = businessInfo.value.latitude ? businessInfo.value.latitude : 41.311081
        const lonValue  = businessInfo.value.longitude ? businessInfo.value.longitude : 69.240562
        let map
        let marker: any
        let circle: any
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
                draggable: false
            })
            // @ts-ignore
            google.maps.event.addListener(map, 'click', (event: any) => {
                marker.setPosition(event.latLng)
                businessInfo.value.latitude = event.latLng.lat()
                businessInfo.value.longitude = event.latLng.lng()
            })
            // @ts-ignore
            circle = new google.maps.Circle({
                map: map,
                center: { lat: latValue, lng: lonValue },
                radius: 5000,
                fillColor: 'red',
                fillOpacity: 0.3,
                strokeColor: 'red',
                strokeOpacity: 0.7,
            })
            // @ts-ignore
            google.maps.event.addListener(map, 'click', (event) => {
                marker.setPosition(event.latLng);
                businessInfo.value.latitude = event.latLng.lat();
                businessInfo.value.longitude = event.latLng.lng();

                circle.setCenter(event.latLng)
            });
        }

        document.head.appendChild(script)
    }
    async function getBusinessInfo(id: string){
        try {
            const response = await $fetch<TBusinessInfo[]>( `https://node-and-mongo-project.herokuapp.com/api/business/${id}`, {
                method: 'GET',
                headers: {
                    'Accept-Language': currentLang.value
                }
            })
            businessInfo.value = {
                id: response[0]._id,
                rate: response[0].rate,
                name: response[0].name,
                price: response[0].price,
                description: response[0].description,
                phone_number1: response[0].phone_number1,
                phone_number2: response[0].phone_number2,
                telegram: response[0].telegram,
                address: response[0].address,
                facebook: response[0].facebook,
                instagram: response[0].instagram,
                latitude: response[0].latitude,
                longitude: response[0].longitude,
                images: response[0].images
            }
            getGoogleMaps()
        } catch (e) {
            console.log(e)
        }
    }

    async function filterResultBusiness(){
        try {
            const categoryFilter = businessId.value ? `?category=${businessId.value}` : ''
            const priceFiler = price.value && businessId.value ? `&price=${price.value}` : `?price=${price.value}`
            const response = await $fetch<TBusiness>( `https://api.talklif.uz/v1/public/business/${categoryFilter}${priceFiler}`, {
                method: 'GET',
                headers: {
                    'Accept-Language': currentLang.value
                }
            })
            businessByCategory.splice(0, businessByCategory.length)
            businessByCategory.push(...response.results as TResultsBusiness[])
        } catch (e) {
            console.log(e)
        }
    }

    function selectedPlace(name: string, id: number) {
        currentBusinessId.value = id
        selectedName.value = name
        event.chooseVendor = false
        event.showCreateEventModal = true
        event.modalStep = false
    }

    return {
        categories,
        showVendorList,
        topPlaces,
        currentBusinessId,
        blogs,
        showWarningModal,
        currentLang,
        businessInfo,
        categoryName,
        showNotification,
        selectedName,
        selectedPlacesId,
        businessByCategory,
        businessId,
        price,
        selectedSearchCategory,
        showApplyBusiness,
        getCategories,
        getBlogs,
        getBusiness,
        filterResultBusiness,
        getBusinessInfo,
        selectedPlace,
        filteredBlogList
    }
})