import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationFailException extends HttpException {
    constructor(objectOrError, description = 'Bad Request'){
        const httpException = HttpException.createBody(
            objectOrError,
            description,
            400
        );
        super(httpException, HttpStatus.BAD_REQUEST);
    }
}