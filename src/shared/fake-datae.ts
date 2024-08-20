// import { JournalType, JournalEntryType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeProfile() {
  return {
    name: faker.person.fullName(),
    profilePic: faker.image.url({width:640, height:480}),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    position: faker.lorem.words(),
  };
}
export function fakeProfileComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    profilePic: faker.image.url({width:640, height:480}),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    position: faker.lorem.words(5),
    userCreated: faker.person.fullName(),
    userModified: undefined,
    dtCreated: new Date(),
    dtModified: undefined,
  };
}
export function fakeUser() {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    hashedPassword: faker.lorem.words(5),
    createdAt: new Date(),
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    hashPassword: faker.lorem.words(5),
    hashedRT: undefined,
    isConfirmed: false,
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
export function fakeJournalCategory() {
  return {
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    updatedAt: undefined,
  };
}
export function fakeJournalCategoryComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    description: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: undefined,
  };
}
// export function fakeJournal() {
//   return {
//     name: faker.person.fullName(),
//     type: faker.helpers.arrayElement([JournalType.Asset, JournalType.Liability, JournalType.Equity, JournalType.Income, JournalType.Expense] as const),
//     description: faker.lorem.words(5),
//     balance: faker.finance.amount({symbol : 'Rp', min: 2, max: 2, autoFormat: true}),
//   };
// }
// export function fakeJournalComplete() {
//   return {
//     id: faker.string.uuid(),
//     bankAccId: faker.lorem.words(5),
//     parentJournalId: undefined,
//     name: faker.person.fullName(),
//     type: faker.helpers.arrayElement([JournalType.Asset, JournalType.Liability, JournalType.Equity, JournalType.Income, JournalType.Expense] as const),
//     description: faker.lorem.words(5),
//     balance: faker.finance.amount({symbol : 'Rp', min: 2, max: 2, autoFormat: true}),
//     createdAt: new Date(),
//     updatedAt: undefined,
//   };
// }
// export function fakeJournalEntry() {
//   return {
//     type: faker.helpers.arrayElement([JournalEntryType.DEBIT, JournalEntryType.CREDIT] as const),
//     journalId: faker.string.uuid(),
//     amount: faker.number.int(),
//     description: faker.lorem.words(5),
//     reference: faker.lorem.words(5),
//     dtTrx: faker.date.anytime(),
//     notaUrl: faker.lorem.words(5),
//     createdBy: faker.lorem.words(5),
//   };
// }
// export function fakeJournalEntryComplete() {
//   return {
//     id: faker.string.uuid(),
//     journalId: faker.string.uuid(),
//     categoryId: faker.string.uuid(),
//     vendorId: faker.string.uuid(),
//     type: faker.helpers.arrayElement([JournalEntryType.DEBIT, JournalEntryType.CREDIT] as const),
//     amount: faker.finance.amount({min:0, max:10000000}),
//     description: faker.lorem.words(5),
//     reference: faker.lorem.words(5),
//     dtTrx: faker.date.anytime(),
//     notaUrl: faker.lorem.words(5),
//     createdAt: new Date(),
//     updatedAt: undefined,
//     createdBy: faker.lorem.words(5),
//     updatedBy: faker.lorem.words(5),
//   };
// }
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
