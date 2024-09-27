import { hash, compare } from 'bcrypt';

const passwordUtils = {
    async hashPassword(password) {
        return await hash(password, 10);
    },

    async comparePasswords(password, hashedPassword) {
        return await compare(password, hashedPassword);
    }
}

export default passwordUtils;