export enum TefillinStatus {
    WITH_SCRIBE = "with_scribe",
    WITH_CHECKER = "with_checker",
    IN_TRANSIT = "in_transit",
    AT_DISTRIBUTION_CENTER = "at_center",
    AT_LOCATION = "at_location",
    ASSIGNED = "assigned",
    DISTRIBUTED = "distributed"
}

export interface Tefillin {
    id: string;
    barcode: string;

    // Production Information
    scribeName?: string;
    checkerName?: string;
    productionDate?: Date;

    // Tracking
    status: TefillinStatus;
    locationId?: string;
    soldierID?: string;

    // Documentation
    parchmentImageUrls?: string[];

    // Donation Information
    donorID?: string;
    donorName?: string;
    inMemoryOf?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}