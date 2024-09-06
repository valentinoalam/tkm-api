import { faker } from '@faker-js/faker';
import {
  NotificationStatus,
  Boundary,
  TransactionType,
  ProgramStatus,
  AccountType,
  WeekDay,
  Period,
  AcquisitionOrigin,
  AssetTypes,
} from '@prisma/client';
import Decimal from 'decimal.js';

export function fakeNotification() {
  return {
    sender: undefined,
    title: faker.lorem.words(5),
    message: faker.lorem.words(5),
    photoUrl: undefined,
    sentAt: faker.date.anytime(),
  };
}
export function fakeNotificationComplete() {
  return {
    id: faker.string.uuid(),
    sender: undefined,
    title: faker.lorem.words(5),
    message: faker.lorem.words(5),
    photoUrl: undefined,
    dtCreated: new Date(),
    sentAt: faker.date.anytime(),
  };
}
export function fakeUserNotification() {
  return {
    status: faker.helpers.arrayElement([
      NotificationStatus.Pending,
      NotificationStatus.Sent,
      NotificationStatus.Failed,
      NotificationStatus.Delivered,
      NotificationStatus.Readed,
    ] as const),
  };
}
export function fakeUserNotificationComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    notification_id: faker.string.uuid(),
    status: faker.helpers.arrayElement([
      NotificationStatus.Pending,
      NotificationStatus.Sent,
      NotificationStatus.Failed,
      NotificationStatus.Delivered,
      NotificationStatus.Readed,
    ] as const),
  };
}
export function fakeProfile() {
  return {
    name: faker.person.fullName(),
    profilePic: undefined,
    phone: undefined,
    address: undefined,
    position: faker.lorem.words(5),
    userCreated: undefined,
    userModified: undefined,
    dtModified: undefined,
  };
}
export function fakeProfileComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    profilePic: undefined,
    phone: undefined,
    address: undefined,
    position: faker.lorem.words(5),
    userCreated: undefined,
    userModified: undefined,
    dtCreated: new Date(),
    dtModified: undefined,
  };
}
export function fakeUser() {
  return {
    email: undefined,
    username: faker.internet.userName(),
    hashedPassword: faker.lorem.words(5),
    hashedRT: undefined,
    updatedAt: undefined,
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    email: undefined,
    username: faker.internet.userName(),
    hashedPassword: faker.lorem.words(5),
    hashedRT: undefined,
    isConfirmed: false,
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeTransactionCategory() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    boundary: faker.helpers.arrayElement([
      Boundary.Permanen,
      Boundary.Sementara,
      Boundary.Tanpa_Batasan,
    ] as const),
  };
}
export function fakeTransactionCategoryComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    boundary: faker.helpers.arrayElement([
      Boundary.Permanen,
      Boundary.Sementara,
      Boundary.Tanpa_Batasan,
    ] as const),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeTransactionActivity() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeTransactionActivityComplete() {
  return {
    id: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    debitAccountId: faker.string.uuid(),
    creditAccountId: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeTransaction() {
  return {
    accountId: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      TransactionType.Pengeluaran,
      TransactionType.Penerimaan,
    ] as const),
    description: faker.lorem.words(5),
    refCode: undefined,
    dtTrx: faker.date.anytime(),
    amount: new Decimal(faker.number.float()),
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
    updatedBy: undefined,
  };
}
export function fakeTransactionComplete() {
  return {
    id: faker.string.uuid(),
    accountId: faker.lorem.words(5),
    activityId: faker.string.uuid(),
    vendorId: undefined,
    mediaId: undefined,
    programId: undefined,
    type: faker.helpers.arrayElement([
      TransactionType.Pengeluaran,
      TransactionType.Penerimaan,
    ] as const),
    description: faker.lorem.words(5),
    refCode: undefined,
    dtTrx: faker.date.anytime(),
    amount: new Decimal(faker.number.float()),
    createdAt: new Date(),
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
    updatedBy: undefined,
  };
}
export function fakeProgram() {
  return {
    budget: new Decimal(faker.number.float()),
    realisation: new Decimal(faker.number.float()),
    uptake: new Decimal(faker.number.float()),
    status: faker.helpers.arrayElement([
      ProgramStatus.Fundraising,
      ProgramStatus.OnProgress,
      ProgramStatus.Completed,
    ] as const),
    updatedAt: undefined,
  };
}
export function fakeProgramComplete() {
  return {
    id: faker.string.uuid(),
    budget: new Decimal(faker.number.float()),
    realisation: new Decimal(faker.number.float()),
    uptake: new Decimal(faker.number.float()),
    status: faker.helpers.arrayElement([
      ProgramStatus.Fundraising,
      ProgramStatus.OnProgress,
      ProgramStatus.Completed,
    ] as const),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeAccount() {
  return {
    code: faker.lorem.words(5),
    name: faker.person.fullName(),
    type: faker.helpers.arrayElement([
      AccountType.Asset,
      AccountType.Liability,
      AccountType.Equity,
      AccountType.Income,
      AccountType.Expense,
    ] as const),
    description: faker.lorem.words(5),
    startBalance: new Decimal(faker.number.float()),
    currentBalance: undefined,
    updatedAt: undefined,
  };
}
export function fakeAccountComplete() {
  return {
    id: faker.string.uuid(),
    parentAccountId: undefined,
    code: faker.lorem.words(5),
    name: faker.person.fullName(),
    type: faker.helpers.arrayElement([
      AccountType.Asset,
      AccountType.Liability,
      AccountType.Equity,
      AccountType.Income,
      AccountType.Expense,
    ] as const),
    description: faker.lorem.words(5),
    startBalance: new Decimal(faker.number.float()),
    currentBalance: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeBankAccount() {
  return {
    bankName: faker.lorem.words(5),
    accountNumber: faker.lorem.words(5),
    onBehalfOf: faker.lorem.words(5),
    description: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeBankAccountComplete() {
  return {
    id: faker.string.uuid(),
    accountId: faker.string.uuid(),
    bankName: faker.lorem.words(5),
    accountNumber: faker.lorem.words(5),
    onBehalfOf: faker.lorem.words(5),
    description: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeTrialBalance() {
  return {
    periodStart: faker.date.anytime(),
    periodEnd: faker.date.anytime(),
    totalDebit: new Decimal(faker.number.float()),
    totalCredit: new Decimal(faker.number.float()),
  };
}
export function fakeTrialBalanceComplete() {
  return {
    id: faker.string.uuid(),
    ledgerId: faker.string.uuid(),
    periodStart: faker.date.anytime(),
    periodEnd: faker.date.anytime(),
    totalDebit: new Decimal(faker.number.float()),
    totalCredit: new Decimal(faker.number.float()),
    createdAt: new Date(),
  };
}
export function fakeTrialBalanceDetail() {
  return {
    openingBalance: new Decimal(faker.number.float()),
    closingBalance: new Decimal(faker.number.float()),
    account: faker.lorem.words(5),
  };
}
export function fakeTrialBalanceDetailComplete() {
  return {
    id: faker.string.uuid(),
    trialBalanceId: faker.string.uuid(),
    isDebit: true,
    openingBalance: new Decimal(faker.number.float()),
    closingBalance: new Decimal(faker.number.float()),
    account: faker.lorem.words(5),
  };
}
export function fakeLedger() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    updatedAt: undefined,
    reportPeriod: faker.helpers.arrayElement([
      Period.DAILY,
      Period.WEEKLY,
      Period.MONTHLY,
      Period.QUARTERLY,
      Period.YEARLY,
    ] as const),
    startWeekDay: faker.helpers.arrayElement([
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
      WeekDay.SATURDAY,
      WeekDay.SUNDAY,
    ] as const),
  };
}
export function fakeLedgerComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
    reportPeriod: faker.helpers.arrayElement([
      Period.DAILY,
      Period.WEEKLY,
      Period.MONTHLY,
      Period.QUARTERLY,
      Period.YEARLY,
    ] as const),
    startWeekDay: faker.helpers.arrayElement([
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
      WeekDay.SATURDAY,
      WeekDay.SUNDAY,
    ] as const),
  };
}
export function fakeVendor() {
  return {
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
    businessField: faker.lorem.words(5),
    note: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeVendorComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
    businessField: faker.lorem.words(5),
    note: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeMediaComplete() {
  return {
    id: faker.string.uuid(),
  };
}
export function fakeImage() {
  return {
    caption: faker.lorem.words(5),
    url: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeImageComplete() {
  return {
    id: faker.string.uuid(),
    mediaId: undefined,
    caption: faker.lorem.words(5),
    url: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeAsset() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    date_acquired: faker.date.anytime(),
    economicLife: faker.number.int(),
    qty: faker.number.int(),
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
    editedBy: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      AssetTypes.Fixed,
      AssetTypes.NonFixed,
      AssetTypes.Current,
      AssetTypes.NonCurrent,
    ] as const),
    origin: faker.helpers.arrayElement([
      AcquisitionOrigin.Donation,
      AcquisitionOrigin.Purchase,
      AcquisitionOrigin.Lease,
      AcquisitionOrigin.Rental,
      AcquisitionOrigin.Pledges,
      AcquisitionOrigin.MosqueBuildingFund,
      AcquisitionOrigin.RemnantProgramFund,
      AcquisitionOrigin.InvestmentReturns,
      AcquisitionOrigin.Grants,
      AcquisitionOrigin.Other,
    ] as const),
  };
}
export function fakeAssetComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    date_acquired: faker.date.anytime(),
    economicLife: faker.number.int(),
    qty: faker.number.int(),
    createdAt: new Date(),
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
    editedBy: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      AssetTypes.Fixed,
      AssetTypes.NonFixed,
      AssetTypes.Current,
      AssetTypes.NonCurrent,
    ] as const),
    origin: faker.helpers.arrayElement([
      AcquisitionOrigin.Donation,
      AcquisitionOrigin.Purchase,
      AcquisitionOrigin.Lease,
      AcquisitionOrigin.Rental,
      AcquisitionOrigin.Pledges,
      AcquisitionOrigin.MosqueBuildingFund,
      AcquisitionOrigin.RemnantProgramFund,
      AcquisitionOrigin.InvestmentReturns,
      AcquisitionOrigin.Grants,
      AcquisitionOrigin.Other,
    ] as const),
  };
}
export function fakeAssetStatus() {
  return {
    availableQty: faker.number.int(),
    totalQty: faker.number.int(),
    note: faker.lorem.words(5),
    updatedBy: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeAssetStatusComplete() {
  return {
    id: faker.string.uuid(),
    assetId: faker.string.uuid(),
    availableQty: faker.number.int(),
    totalQty: faker.number.int(),
    note: faker.lorem.words(5),
    updatedBy: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeTag() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeTagComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeAssetTagsComplete() {
  return {
    id: faker.string.uuid(),
    assetId: faker.string.uuid(),
    tagId: faker.string.uuid(),
  };
}
export function fakePosition() {
  return {
    name: faker.person.fullName(),
    periode: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakePositionComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    eventId: undefined,
    name: faker.person.fullName(),
    periode: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeFamilyMember() {
  return {
    name: faker.person.fullName(),
    information: faker.lorem.words(5),
    relationType: faker.lorem.words(5),
  };
}
export function fakeFamilyMemberComplete() {
  return {
    id: faker.string.uuid(),
    participantId: faker.string.uuid(),
    name: faker.person.fullName(),
    information: faker.lorem.words(5),
    relationType: faker.lorem.words(5),
  };
}
export function fakeParticipant() {
  return {
    withFamily: faker.datatype.boolean(),
    updatedAt: undefined,
  };
}
export function fakeParticipantComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    eventId: faker.string.uuid(),
    profileId: faker.string.uuid(),
    emergencyId: faker.string.uuid(),
    withFamily: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeEmergencyContact() {
  return {
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    relationType: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeEmergencyContactComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    relationType: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeUstadz() {
  return {
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
  };
}
export function fakeUstadzComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
  };
}
export function fakeUstadzEventComplete() {
  return {
    id: faker.string.uuid(),
    ustadzId: faker.string.uuid(),
    eventId: faker.string.uuid(),
  };
}
export function fakeEvent() {
  return {
    name: faker.person.fullName(),
    place: faker.lorem.words(5),
    dtStart: faker.date.anytime(),
    dtEnd: faker.date.anytime(),
    quota: faker.number.int(),
    description: faker.lorem.words(5),
    heldPeriod: undefined,
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
  };
}
export function fakeEventComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    place: faker.lorem.words(5),
    dtStart: faker.date.anytime(),
    dtEnd: faker.date.anytime(),
    quota: faker.number.int(),
    description: faker.lorem.words(5),
    heldPeriod: undefined,
    createdAt: new Date(),
    updatedAt: undefined,
    createdBy: faker.lorem.words(5),
  };
}
