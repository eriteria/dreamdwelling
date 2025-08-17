const mockAxios = {
  get: jest.fn(),
  create: () => mockAxios,
};

export default mockAxios;
export const get = mockAxios.get;
