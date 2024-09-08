const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
    // Arrange
        const userRepository = new CommentRepository();

        // Action and Assert
        await expect(userRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.verifyAvailableCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.verifyCommentByOwner('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.getCommentsInAThread('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(userRepository.deleteComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
