import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ElementPlus from 'element-plus';
const db = vi.hoisted(() => ({ collection: vi.fn(), get: vi.fn(), add: vi.fn(), doc: vi.fn(), update: vi.fn(), delete: vi.fn() }));
vi.mock('../src/firebaseInit', () => ({ default: { firestore: () => db } }));
import App from '../src/App.vue';
beforeEach(() => {
  vi.clearAllMocks();
  db.collection.mockReturnValue(db); db.doc.mockReturnValue(db);
  db.get.mockResolvedValue({ forEach: fn => fn({ id: 'one', data: () => ({ name: 'Jane', date: '2026-10-25' }) }) });
  db.add.mockResolvedValue({}); db.update.mockResolvedValue({}); db.delete.mockResolvedValue({});
});
describe('employee table', () => {
  it('renders employee rows, actions and filters with Element Plus', async () => {
    const wrapper = mount(App, { global: { plugins: [ElementPlus] } });
    await flushPromises();
    expect(wrapper.text()).toContain('Jane');
    expect(wrapper.text()).toContain('Add New Employee');
    expect(wrapper.text()).toContain('Edit');
    await wrapper.get('input[placeholder="Type to search"]').setValue('absent');
    await flushPromises();
    expect(wrapper.text()).not.toContain('Jane');
    wrapper.unmount();
  });
  it('preserves create, update and delete payloads', async () => {
    const wrapper = mount(App, { global: { plugins: [ElementPlus] } });
    await flushPromises();
    wrapper.vm.createEmployee('', '2026-10-25'); expect(db.add).not.toHaveBeenCalled();
    wrapper.vm.createEmployee('Alice', '2026-10-25'); await flushPromises();
    expect(db.add).toHaveBeenCalledWith({name:'Alice',date:'2026-10-25'});
    wrapper.vm.updateEmployee('one','Bob','2026-10-26'); await flushPromises();
    expect(db.doc).toHaveBeenCalledWith('one');expect(db.update).toHaveBeenCalledWith({name:'Bob',date:'2026-10-26'});
    wrapper.vm.deleteEmployee('one');await flushPromises();expect(db.delete).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
});
