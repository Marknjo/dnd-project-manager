/**
 * Base State management class (abstract)
 **/
abstract class Store<P extends object, L extends Function> {
  /**
   * Tracts Submitted project items
   */
  store: P[] = [];

  /**
   * Tracks Submitted action creators
   */
  listeners: L[] = [];

  // Get Store content
  get getStore() {
    return this.store;
  }

  constructor() {}

  /**
   *
   * @param listenerFn A function that triggers and action
   */
  addListener(listenerFn: L) {
    this.listeners.push(listenerFn);
  }

  /**
   * Add Payload to the Project
   */
  addPayload(payload: P) {
    this.store.push(payload);

    // Update listeners that the store has been updated
    this.updateListeners();
  }

  /**
   * Project Listener
   */
  protected updateListeners() {
    this.listeners.forEach(listenerFn => {
      return listenerFn(this.store.slice());
    });
  }
}

export default Store;
