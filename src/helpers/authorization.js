// package
import { AccessControl } from 'role-acl';

// Consts 
const AC = new AccessControl();

class Authorization {
    constructor() {
    }

    verifyToken(data) {
        return data;
    }

    verifyRole(address, userType) {

    }

    defineRoles() {
        AC.grant('deleted');
        AC.grant('user')
            .execute('upload-profile').on('POST');

        AC.grant('affiliate')
            .extend('user');

        AC.grant('vip')
            .extend('affiliate')
            .execute('upload-product').on('POST');

        AC.grant('superadmin')
            .extend('vip')
            .execute('upload-category').on('POST')
            .execute('upload-brand').on('POST');

        return AC;
    }
}

export default Authorization;