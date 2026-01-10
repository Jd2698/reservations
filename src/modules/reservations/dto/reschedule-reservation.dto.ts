import { IsISO8601, IsNotEmpty } from "class-validator";

export class RescheduleReservationDto {

    @IsNotEmpty()
    @IsISO8601({ strict: true })
    startTime: string;

    @IsNotEmpty()
    @IsISO8601({ strict: true })
    endTime: string;
}