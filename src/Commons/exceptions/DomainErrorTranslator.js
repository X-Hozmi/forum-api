const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error; /* eslint-disable-line no-underscore-dangle */
    },
};

DomainErrorTranslator._directories = { /* eslint-disable-line no-underscore-dangle */
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus berupa string'),
    'ADD_THREAD.TITLE_LIMIT_CHAR': new InvariantError('judul terlalu panjang'),
    'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus berupa string'),
    'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus berupa string'),
    'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus berupa string'),
    'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus berupa string'),
    'AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus sesuai'),
    'USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus sesuai'),
    'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus sesuai'),
    'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus sesuai'),
    'REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dikirim kurang lengkap'),
    'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('data yang dikirim harus sesuai'),
};

module.exports = DomainErrorTranslator;
