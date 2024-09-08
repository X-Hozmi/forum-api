const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
    // Arrange
        const userRepository = new ReplyRepository();

        // Action and Assert
        await expect(userRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.verifyAvailableReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.verifyReplyByOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.getRepliesInAThread('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
