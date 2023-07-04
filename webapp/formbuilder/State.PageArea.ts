import { FormSchemaPage } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStatePageAreaSlice {
  addPage(index?: number): void;
  removePage(page: FormSchemaPage): void;
}

export function createFormBuilderPageAreaSlice({ get }: State<FormBuilderState>): FormBuilderStatePageAreaSlice {
  return {
    addPage(index = -1) {
      const { schema, setSchema } = get();
      const currentPages = schema.pages ?? [];
      const newPage: FormSchemaPage = {
        id: '',
        title: '',
        elements: [],
      };

      const nextPages = [...currentPages];
      nextPages.splice(index, 0, newPage);

      setSchema({
        ...schema,
        pages: nextPages,
      });
    },

    removePage(page) {
      const { schema, setSchema } = get();
      const currentPages = schema.pages ?? [];

      setSchema({
        ...schema,
        pages: currentPages.filter((p) => p !== page),
      });
    },
  };
}
