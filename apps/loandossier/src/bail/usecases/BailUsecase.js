export default class BailUsecase {
  async create({ request, bailService }) {
    await bailService.create(request);
  }

  async activeChange({ request, bailService }) {
    await bailService.activeChange(request);
  }
}
