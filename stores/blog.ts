import { Ref, ref, reactive } from 'vue'
import { homePageData } from "~/stores/home-page"
import { defineStore } from 'pinia'
import { authInfo } from "~/stores/auth";
import { TBusinessResult, TCurrentBlog} from "~/types";

export const blogInfo = defineStore('blogInfo', () => {
    const currentCategory: Ref<string | null> = ref('Все')
    const home = homePageData()
    const auth = authInfo()
    const selectedAll: Ref<boolean> = ref(true)
    const tags = reactive([])
    const uniqueTags = reactive([])
    const currentBlog = ref<TCurrentBlog>({
        id: 0,
        name: '',
        created_at: '',
        tags: [
            {
                id: 0,
                name: '',
            }
        ],
        body: '',
        images: [
            ''
        ]
    })
    function filterByTags(tag: string | null) {
        if (typeof tag === 'string') {
            currentCategory.value = tag
            selectedAll.value = false
        } else {
            currentCategory.value = 'Все'
            selectedAll.value = true
        }
    }

    async function getCurrentBlog(id: string) {
        try {
            const response = await $fetch<TCurrentBlog>( `https://api.talklif.uz/v1/public/blog/${id}/`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            currentBlog.value = {
                id: response.id,
                name: response.name,
                created_at: response.created_at,
                tags: [
                    {
                        id: response.id,
                        name: response.name,
                    }
                ],
                body: response.body,
                images: response.images
            }
            if(!tags.length) { // @ts-ignore
                tags.push(...response.tags)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return {
        currentCategory,
        currentBlog,
        tags,
        uniqueTags,
        selectedAll,
        filterByTags,
        getCurrentBlog
    }
})