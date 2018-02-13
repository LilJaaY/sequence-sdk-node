import { Client } from '../client'
import { Consumer, ObjectCallback, QueryParams, sharedAPI } from '../shared'

/**
 * A blockchain consists of an immutable set of cryptographically linked
 * transactions. Each transaction contains one or more actions.
 *
 * More info: {@link https://dashboard.seq.com/docs/transactions}
 * @typedef {Object} Transaction
 * @global
 *
 * @property {String} id
 * Unique transaction identifier.
 *
 * @property {String} timestamp
 * Time of transaction, RFC3339 formatted.
 *
 * @property {Number} sequenceNumber
 * Sequence number of the transaction.
 *
 * @property {Object} referenceData
 * User specified, unstructured data embedded within a transaction.
 *
 * @property {TransactionAction[]} actions
 * List of specified actions for a transaction.
 */

/**
 * @typedef {Object} TransactionAction
 * @global
 *
 * @property {String} type
 * The type of the action. Possible values are "issue", "transfer", and "retire".
 *
 * @property {String} flavorId
 * The id of the action's flavor.
 *
 * @property {Hash} flavorTags
 * The tags of the action's flavor (possibly null).
 *
 * @property {String} assetId
 * **Deprecated. Use flavorId instead.**
 * The id of the action's asset.
 *
 * @property {String} assetAlias
 * **Deprecated. Use flavorId instead.**
 * The alias of the action's asset (possibly null).
 *
 * @property {Hash} assetTags
 * **Deprecated. Use flavorTags instead.**
 * The tags of the action's asset (possibly null).
 *
 * @property {Integer} amount
 * The number of units of the action's flavor.
 *
 * @property {String} sourceAccountId
 * The id of the account transferring the flavor (possibly null if the
 * action is an issuance).
 *
 * @property {String} sourceAccountAlias
 * **Deprecated. Use sourceAccountId instead.**
 * The alias of the account transferring the flavor (possibly null if the
 * action is an issuance).
 *
 * @property {String} sourceAccountTags
 * The tags associated with the source account (possibly null).
 *
 * @property {String} destinationAccountId
 * The id of the account receiving the flavor (possibly null if the
 * action is a retirement).
 *
 * @property {String} destinationAccountAlias
 * **Deprecated. Use destinationAccountId instead.**
 * The alias of the account receiving the flavor (possibly null if the
 * action is a retirement).
 *
 * @property {String} destinationAccountTags
 * The tags associated with the destination account (possibly null).
 *
 * @property {Object} referenceData
 * User specified, unstructured data embedded within an action (possibly null).
 */

/**
 * @class
 * A convenience class for building transaction template objects.
 */
export class TransactionBuilder {
  public actions: any[]
  public referenceData: any

  /**
   * constructor - return a new object used for constructing a transaction.
   */
  constructor() {
    /**
     * List of actions to send to the build-transaction API.
     * @name TransactionBuilder#actions
     * @type Array
     */
    this.actions = []

    /**
     * Reference data for the transaction. You can specify reference data at
     * both the transaction level and for each action.
     * @name TransactionBuilder#referenceData
     * @type Object
     */
    this.referenceData = null
  }

  /**
   * Add an action that issues flavors.
   *
   * @param {Object} params - Action parameters.
   * @param {String} params.flavorId - ID of flavor to be issued.
   * @param {String} params.assetId - **Deprecated. Use flavorId instead.**
   *   Asset ID specifying the asset to be issued.
   *   You must specify either an ID or an alias.
   * @param {String} params.assetAlias - **Deprecated. Use flavorId instead.**
   *   Asset alias specifying the asset to be issued.
   *   You must specify either an ID or an alias.
   * @param {String} params.amount - Amount of the flavor to be issued.
   * @param {String} params.destinationAccountId - Account ID specifying the
   *   account controlling the flavor.
   *   You must specify a destination account ID or alias.
   * @param {String} params.destinationAccountAlias - **Deprecated. Use
   *   destinationAccountId instead.** Account alias specifying the account
   *   controlling the asset. You must specify a destination account ID or
   *   alias.
   * @param {Object} params.referenceData - Reference data to add to the receiving contract.
   */
  public issue(params: {
    flavorId?: string
    assetId?: string
    assetAlias?: string
    amount: number
    destinationAccountId?: string
    destinationAccountAlias?: string
    referenceData?: object
  }) {
    this.actions.push(Object.assign({}, params, { type: 'issue' }))
  }

  /**
   * Add an action that retires units of a flavor.
   *
   * @param {Object} params - Action parameters.
   * @param {String} params.sourceAccountId - Account ID specifying the account
   *   controlling the flavor. You must specify a source account ID, account
   *   alias, or contract ID.
   * @param {String} params.sourceAccountAlias - **Deprecated. Use
   *   sourceAccountId instead.** Account alias specifying the account
   *   controlling the asset. You must specify a source account ID, account
   *   alias, or contract ID.
   * @param {String} params.sourceContractId - Contract holding the flavor.
   *   You must specify a source account ID, account alias, or contract ID.
   * @param {String} params.flavorId - ID of flavor to be retired.
   * @param {String} params.assetId - **Deprecated. Use flavorId instead.**
   *   Asset ID specifying the asset to be retired.
   *   You must specify either an ID or an alias.
   * @param {String} params.assetAlias - **Deprecated. Use flavorId instead.**
   *   Asset alias specifying the asset to be retired.
   *   You must specify either an ID or an alias.
   * @param {Number} params.amount - Amount of the flavor to be retired.
   * @param {Object} params.referenceData - Reference data to add to the retiring contract.
   * @param {Object} params.changeReferenceData - Reference data to add to the change contract, if it is necessary.
   */
  public retire(params: {
    sourceAccountId?: string
    sourceAccountAlias?: string
    sourceContractId?: string
    flavorId?: string
    assetId?: string
    assetAlias?: string
    amount: number
    referenceData?: object
    changeReferenceData?: object
  }) {
    this.actions.push(Object.assign({}, params, { type: 'retire' }))
  }

  /**
   * Moves flavors from a source (an account or contract) to a destination
   * account.
   *
   * @param {Object} params Action parameters
   * @param {String} params.sourceAccountId - Account ID specifying the account
   *   controlling the flavor. You must specify a source account ID, account
   *   alias, or contract ID.
   * @param {String} params.sourceAccountAlias - **Deprecated. Use
   *   sourceAccountId instead.** Account alias specifying the account
   *   controlling the asset. You must specify a source account ID, account
   *   alias, or contract ID.
   * @param {String} params.sourceContractId - Contract holding the flavor.
   *   You must specify a source account ID, account alias, or contract ID.
   * @param {String} params.assetId - **Deprecated. Use flavorId instead.**
   *   Asset ID specifying the asset to be transferred.
   *   You must specify either an ID or an alias.
   * @param {String} params.assetAlias -  **Deprecated. Use flavorId instead.**
   *   Asset alias specifying the asset to be transferred.
   *   You must specify either an ID or an alias.
   * @param {Integer} params.amount - Amount of the flavor to be transferred.
   * @param {String} params.destinationAccountId - Account ID specifying the
   *   account controlling the flavor. You must specify a destination account ID
   *   or alias.
   * @param {String} params.destinationAccountAlias - **Deprecated. Use
   *   destinationAccountId instead.** Account alias specifying the account
   *   controlling the asset. You must specify a destination account ID or
   *   alias.
   * @param {Object} params.referenceData - Reference data to add to the receiving contract.
   * @param {Object} params.changeReferenceData - Reference data to add to the change contract, if it is necessary.
   */
  public transfer(params: {
    sourceAccountId?: string
    sourceAccountAlias?: string
    sourceContractId?: string
    flavorId?: string
    assetId?: string
    assetAlias?: string
    amount: number
    destinationAccountId?: string
    destinationAccountAlias?: string
    referenceData?: object
    changeReferenceData?: object
  }) {
    this.actions.push(Object.assign({}, params, { type: 'transfer' }))
  }
}

export interface TransactionQueryParameters extends QueryParams {
  startTime?: number
  endTime?: number
  timeout?: number
}

/**
 * API for interacting with {@link Transaction transactions}.
 *
 * More info: {@link https://dashboard.seq.com/docs/transactions}
 * @module TransactionsApi
 */
export const transactionsAPI = (client: Client) => {
  /**
   * Processing callback for building a transaction. The instance of
   * {@link TransactionBuilder} modified in the function is used to
   * build a transaction in Sequence.
   *
   * @callback builderCallback
   * @param {TransactionBuilder} builder
   */

  return {
    /**
     * Get one page of transactions matching the specified query.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.startTime -  A Unix timestamp in milliseconds. When specified, only transactions with a block time greater than the start time will be returned.
     * @param {Number} params.endTime - A Unix timestamp in milliseconds. When specified, only transactions with a block time less than the start time will be returned.
     * @param {Number} params.timeout - A time in milliseconds after which a server timeout should occur. Defaults to 1000 (1 second).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {pageCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Page<Transaction>>} Requested page of results.
     */
    queryPage: (params: TransactionQueryParameters, cb: any) =>
      sharedAPI.queryPage(
        client,
        'transactions',
        'queryPage',
        '/list-transactions',
        params,
        {
          cb,
        }
      ),

    /**
     * Iterate over all transactions matching the specified query, calling the
     * supplied consume callback once per item.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.startTime -  A Unix timestamp in milliseconds. When specified, only transactions with a block time greater than the start time will be returned.
     * @param {Number} params.endTime - A Unix timestamp in milliseconds. When specified, only transactions with a block time less than the start time will be returned.
     * @param {Number} params.timeout - A time in milliseconds after which a server timeout should occur. Defaults to 1000 (1 second).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {QueryProcessor<Transaction>} processor - Processing callback.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryEach: (
      params: TransactionQueryParameters,
      consumer: Consumer,
      cb?: ObjectCallback
    ) => sharedAPI.queryEach(client, 'transactions', params, consumer, { cb }),

    /**
     * Request all transactions matching the specified query, calling the
     * supplied processor callback with each item individually.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.startTime -  A Unix timestamp in milliseconds. When specified, only transactions with a block time greater than the start time will be returned.
     * @param {Number} params.endTime - A Unix timestamp in milliseconds. When specified, only transactions with a block time less than the start time will be returned.
     * @param {Number} params.timeout - A time in milliseconds after which a server timeout should occur. Defaults to 1000 (1 second).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {QueryProcessor<Transaction>} processor - Processing callback.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryAll: (params: TransactionQueryParameters, cb?: ObjectCallback) =>
      sharedAPI.queryAll(client, 'transactions', params, { cb }),

    /**
     * Builds, signs, and submits a transaction.
     *
     * @param {module:TransactionsApi~builderCallback} builderBlock - Function that adds desired actions
     *                                         to a given builder object.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Transaction>} Transaction object, or error.
     */
    transact: (
      builderBlock: ((builder: TransactionBuilder) => void),
      cb?: ObjectCallback
    ) => {
      const builder = new TransactionBuilder()

      try {
        builderBlock(builder)
      } catch (err) {
        return Promise.reject(err)
      }

      const makePromise = async () => {
        const tpl = await client.request('/build-transaction', builder)
        const signed = await client.request('/sign-transaction', {
          transaction: tpl,
        })
        return client.request('/submit-transaction', { transaction: signed })
      }
      return sharedAPI.tryCallback(makePromise(), cb)
    },
  }
}
