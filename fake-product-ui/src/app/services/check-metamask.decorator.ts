export function CheckMetaMask()
{
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const self = this as any;
        await self.checkMetaMask();
      } catch (err) {
        console.error("MetaMask check failed:", err);
        // Optionally show user notification here
        throw err;  // prevent original method execution if check fails
      }

      return original.apply(this, args);
    };

    return descriptor;
  }
}
