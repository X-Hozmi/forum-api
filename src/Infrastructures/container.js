/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

// orm models
const {
    AuthenticationModel, UserModel, ThreadModel, CommentModel, ReplyModel,
} = require('./orm/index');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/repositories/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepository = require('../Domains/repositories/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepository = require('../Domains/repositories/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepository = require('../Domains/repositories/comments/CommentRepository');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepository = require('../Domains/repositories/replies/ReplyRepository');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const PasswordHash = require('../Applications/security/PasswordHash');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../Applications/use_case/DetailThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
    {
        key: UserRepository.name,
        Class: UserRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: UserModel,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: AuthenticationRepository.name,
        Class: AuthenticationRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: AuthenticationModel,
                },
            ],
        },
    },
    {
        key: ThreadRepository.name,
        Class: ThreadRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: ThreadModel,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: CommentRepository.name,
        Class: CommentRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: CommentModel,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: ReplyRepository.name,
        Class: ReplyRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: ReplyModel,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: PasswordHash.name,
        Class: BcryptPasswordHash,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt,
                },
            ],
        },
    },
    {
        key: AuthenticationTokenManager.name,
        Class: JwtTokenManager,
        parameter: {
            dependencies: [
                {
                    concrete: Jwt.token,
                },
            ],
        },
    },
]);

// registering use cases
container.register([
    {
        key: AddUserUseCase.name,
        Class: AddUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: LoginUserUseCase.name,
        Class: LoginUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: LogoutUserUseCase.name,
        Class: LogoutUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
            ],
        },
    },
    {
        key: RefreshAuthenticationUseCase.name,
        Class: RefreshAuthenticationUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
            ],
        },
    },
    {
        key: AddThreadUseCase.name,
        Class: AddThreadUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: DetailThreadUseCase.name,
        Class: DetailThreadUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'replyRepository',
                    internal: ReplyRepository.name,
                },
            ],
        },
    },
    {
        key: AddCommentUseCase.name,
        Class: AddCommentUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
            ],
        },
    },
    {
        key: DeleteCommentUseCase.name,
        Class: DeleteCommentUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
            ],
        },
    },
    {
        key: AddReplyUseCase.name,
        Class: AddReplyUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'replyRepository',
                    internal: ReplyRepository.name,
                },
            ],
        },
    },
    {
        key: DeleteReplyUseCase.name,
        Class: DeleteReplyUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'replyRepository',
                    internal: ReplyRepository.name,
                },
            ],
        },
    },
]);

module.exports = container;
