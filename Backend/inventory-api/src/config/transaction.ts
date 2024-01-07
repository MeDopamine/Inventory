// const {Sequelize, sequelize} = require('../db/models')

// const create = async () => {
//     try{
//         const t = await sequelize.transaction({
//             isolationLevel: Sequelize.Transaction.READ_UNCOMMITTED
//         });
//         return Promise.resolve({
//             status: true,
//             data: t
//         })
//     } catch (error){
//         return Promise.reject({
//             status: false,
//             error
//         })
//     }

// }

// const commit = async transaction => {
//     try {
//         await transaction.commit()
//     } catch (error) {
//         await rollback(transaction)
//         return Promise.reject({
//             status: false,
//             error
//         })
//     }
// }

// const rollback = async transaction =>{
//     try {
//         await transaction.rollback()
//     } catch (error) {
//         return Promise.reject({
//             status: false,
//             error
//         })
//     }
// }

// module.exports = {
//     create, commit, rollback
// }

// import { Sequelize, Transaction } from 'sequelize';
// import { sequelize } from '../db/models'; // Assuming you export sequelize from '../db/models'

// const create = async (): Promise<{ status: boolean; data?: Transaction; error?: any }> => {
//   try {
//     const t = await sequelize.transaction({
//       isolationLevel: Sequelize.Transaction.READ_UNCOMMITTED,
//     });
//     return Promise.resolve({
//       status: true,
//       data: t,
//     });
//   } catch (error) {
//     return Promise.reject({
//       status: false,
//       error,
//     });
//   }
// };

// const commit = async (transaction: Transaction): Promise<{ status: boolean; error?: any }> => {
//   try {
//     await transaction.commit();
//     return Promise.resolve({ status: true });
//   } catch (error) {
//     await rollback(transaction);
//     return Promise.reject({
//       status: false,
//       error,
//     });
//   }
// };

// const rollback = async (transaction: Transaction): Promise<{ status: boolean; error?: any }> => {
//   try {
//     await transaction.rollback();
//     return Promise.resolve({ status: true });
//   } catch (error) {
//     return Promise.reject({
//       status: false,
//       error,
//     });
//   }
// };

// export { create, commit, rollback };
