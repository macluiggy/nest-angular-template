function wait(n: number) {
  return new Promise((resolve) => setTimeout(resolve, n));
}

export default wait;
