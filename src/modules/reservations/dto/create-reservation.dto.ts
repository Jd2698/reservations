import { ReservationStatus } from "@app/generated/prisma/enums";
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateReservationDto {

    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsNotEmpty()
    @IsUUID()
    roomId: string;

    @IsNotEmpty()
    @IsISO8601({ strict: true })
    startTime: string;

    @IsNotEmpty()
    @IsISO8601({ strict: true })
    endTime: string;

    @IsOptional()
    @IsEnum(ReservationStatus, {
        message: `Valid status are ${Object.values(ReservationStatus)}`
    })
    status?: ReservationStatus;
}