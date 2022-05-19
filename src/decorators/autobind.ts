/**
 * Enable autodind feature to the events handlers
 */
const Autobind = (_: any, _1: string, descriptor: PropertyDescriptor) => {
  // Assign Default method
  const originalMethod = descriptor.value;

  // Autobind
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  // Return new method
  return adjDescriptor;
};

export default Autobind;
