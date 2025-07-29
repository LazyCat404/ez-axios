import ezAxios, { AloneSet } from './ezAxiosConfig';
import get from './get';
import post from './post';
import put from './put';
import del from './del';
import Loading from './Loading';

export { get, post, put, del, AloneSet, Loading };

export type { ezAxiosOptions } from './ezAxiosConfig';

export default ezAxios;
