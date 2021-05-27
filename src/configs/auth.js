export default {
    '/api/v1/upload/product': {
        method: 'POST',
        isAuth: true,
        name: 'upload-product'
    },
    '/api/v1/upload/profile': {
        method: 'POST',
        isAuth: true,
        name: 'upload-profile'
    },
    '/api/v1/upload/category': {
        method: 'POST',
        isAuth: true,
        name: 'upload-category'
    },
    '/api/v1/upload/brand': {
        method: 'POST',
        isAuth: true,
        name: 'upload-brand'
    },
    '/api/v1/upload/show/:name': {
        method: 'GET',
        isAuth: false,
        name: 'upload-show'
    }
}