export type TCategoties = {
    id: number
    name: string;
    icon?: string;
    category_feature?: string;
}

export type TUserData = {
    name: string;
    password: string;
}

export type TUserDataResult = {
    name: string;
    role: string;
    token: string;
}

export type TPlaces = {
    count: number;
    next: null;
    previous: null;
    results: [
        {
            id: number;
            rate: number;
            name: string;
            min_value: number;
            max_value: number;
            price: number;
            district?: string;
            images: [
                {
                    image?: string | null;
                    is_main: boolean;
                }
            ]
        }
    ]
}

export type TFavorites = {
    count: number;
    next: null;
    previous: null;
    results: [
        {
            _id: number;
            business: {
                id: number;
                rate: number;
                name: string;
                min_value: number;
                max_value: number;
                price: number;
                district: string;
            }
        }
    ]
}

export type TResults = {
    _id: number;
    rate?: number;
    name: string;
    price: number;
    district?: {
        id: number;
        name: string;
    }
    images?: TImageBusiness[]
}

export type TBusiness = {
    count: number;
    next: null;
    previous: null;
    results: TResultsBusiness[]
}

export type TResultsBusiness = {
    id: number;
    rate?: number;
    name: string;
    price: number;
    district?: {
        id: number;
        name: string;
    }
    images:  [
        {
            is_main: boolean;
            image: {
                file: string;
                id?: number | undefined;
            }
        }
    ]
}

export type TFavoriteResults = {
    id: number;
    business: {
        id: number;
        rate: number;
        name: string;
        min_value: number;
        max_value: number;
        price: number;
        district: string;
        images: [
            {
                is_main: boolean,
                image: {
                    file: string
                }
            }
        ]
    }
}

export type TReviewsResult = {
    assigned_rating: string;
    created_at: string;
    text: string;
    user: {
        name: string
    };
    _id?: string;
    business: TBusinessResult;
}

export type TReviews = {
    count: number;
    next: null;
    previous: null;
    results: [
        {
            assigned_rating: number;
            created_at: string;
            text: string;
            user: number;
            id: number;
            business: {
                id: number;
                rate: number;
                name: string;
                min_value: number;
                max_value: number;
                price: number;
                district: string;
            }
        }
    ]
}

export type TBlogs = {
    results: TBlogsResult[]
}

export type TEvents = {
    id: number;
    name: string;
    date?: string;
}

export type TLang = {
    id: number;
    name: string;
    code: string;
    img: string;
}

export type TAuthWithSMSCode = {
    phone_number: string;
    sms_code: string;
}

export type TNumberAuth = Pick<TAuthWithSMSCode, 'phone_number'>

export type TAccessData = {
    access: string;
    refresh: string;
}

export type TProfile = {
    _id: string;
    name: string;
    password?: string;
    user_type: string;
}

export type TImageId = Pick<TProfile, '_id'>

export type TUserUpdateData = {
    name?: string,
}

export type TBusinessInfo = {
    _id: string;
    name?: string;
    rate?: number;
    rate_count?: string;
    description?: string;
    min_value?: number;
    max_value?: number;
    price: number;
    phone_number1?: string;
    phone_number2?: string;
    district?: {
        id?: number;
        name?: string;
        region?: string;
    },
    address?: string;
    longitude?: number;
    latitude?: number;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    category?: {
        id?: number;
        name?: string;
        icon?: {
            id?: number;
            file?: string;
            file_type?: string;
            thumbnail?: string;
        },
        category_feature?: {
            id?: number;
            code?: string;
            name?: string;
        }
    },
    owner?: {
        id?: number;
        phone_number?: string;
        full_name?: string;
        profile_image?: number;
        date_joined?: string;
        user_type?: string;
    },
    images?: [
        {
            id?: number,
            image?: number,
            is_main?: boolean;
            created_at?: string;
        }
    ]
}

export type TRegistrationUser = {
    phone_number: string;
    user_type: string;
}

export type TBusinessAll = {
    count: number;
    next: null;
    previous: null;
    results: [
        {
            address: string;
            category: number;
            description: string;
            district?: number;
            facebook: string;
            id: number;
            images?: TImageBusiness[];
            instagram: string;
            latitude: string;
            longitude: string;
            max_value: number;
            min_value: number;
            name: string;
            owner: number;
            phone_number1: string
            phone_number2: string
            price: number;
            telegram: string;
            status?: string;
        }
    ]
}

export type TBusinessResult = {
    address?: string;
    description?: string;
    district?: string;
    facebook?: string;
    _id?: string;
    instagram?: string;
    latitude?: string;
    longitude?: string;
    max_value?: number;
    min_value?: number;
    name: string;
    owner?: number;
    phone_number1?: string
    phone_number2?: string
    price: number;
    telegram?: string
    images?: TImageBusiness[]
    status?: string;
}

export type TImagesFile = {
    image: number;
    is_main: boolean;
}

export type TImageBusiness = {
    is_main: boolean;
    image: {
        file: string;
        id?: number;
    }
}

export type TBusinessReview = {
    assigned_rating: number;
    created_at: string;
    id: number;
    text: string
    user: {
        full_name: string;
        profile_image: {
            file: string
        }
    }
}

export type TEditReview = {
    assigned_rating: number;
    business: number;
    text: string;
}
export type TEditReviewResponse = {
    assigned_rating: number;
    business: number;
    text: string;
    user: number;
    created_at: string;
    id: number;
}

export type TResponseBusinessReview = {
    count: number;
    next: null;
    previous: null;
    results: TBusinessReview[]
}

export type TRegion = {
    id: number;
    name: string;
    districts: TCity[]
}

export type TCity = Pick<TRegion, 'id' | 'name'>

export type TBusinessImage = {
    file: string;
    id: number;
}

export type TReadyEvents = {
    id: number;
    name: string;
    suggested_tasks: TSuggestedTasks[]
}

export type TSuggestedTasks = Pick<TReadyEvents, 'id' | 'name'>

export type TAllTasks = {
    count: number;
    next: null;
    previous: null;
    results: [{
        id: number;
        event: number;
        name: string;
        task_type: null;
        date_time: string;
        description: string;
        business: number;
        user: number;
        is_done: boolean;
    }]
}

export type TAllTasksResult = {
    id: number;
    event: number;
    name: string;
    task_type: null;
    date_time: string;
    description: string;
    business: number;
    user?: number;
    is_done: boolean;
}

export type TInvitation = {
    can_change: boolean;
    id: number;
    event: TEvents;
    is_accepted: boolean;
    inviter: TInviter
}

export type TInviter = {
    date_joined: string;
    full_name: string;
    id: number;
    phone_number: string;
    profile_image: {
        file: string;
    }
}

export type TInvitedUserResult = {
    can_change: boolean;
    id: number;
    is_accepted: boolean;
    invited_user: TInviter
}

export type TInvitedUser = {
    results: TInvitedUserResult[]
}

export type TEditTask = {
    date_time?: string;
    name: string;
    task_type?: number;
    event: number;
    business?: number;
    is_done?: boolean;
    description?: string;
    id?: number;
}

export type TFuncTask = Pick<TEditTask, 'name' | 'id' | 'task_type' | 'event'| 'business'| 'is_done'>

export type TBlogsResult = {
    id: number;
    name: string;
    created_at: string;
    body_short: string;
    tags: [
        {
            id: number;
            name: string;
        }
    ]
}

export type TCurrentBlog = {
    id: number;
    name: string;
    created_at: string;
    tags: [
        {
            id: number;
            name: string;
        }
    ];
    body: string;
    images?: string[];
}