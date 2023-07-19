import { csrdFormSchema, updatedCsrdFormSchema } from '../formengine/schemas/CsrdSchema';
import { demoFormSchema } from '../formengine/schemas/DemoFormSchema';
import { createCustomerEntity, deleteCustomerEntity, getAllCustomerEntities } from './CustomerEntity';
import { createFormSchemaEntity, deleteFormSchemaEntity, getAllFormSchemaEntities } from './FormSchemaEntity';
import { deleteFormSchemaResultEntity, getAllFormSchemaResultEntities } from './FormSchemaResultEntity';

/**
 * Deletes all entities in the backend and then creates default demo data.
 */
export async function resetBackend() {
  for (const formSchemaResult of (await getAllFormSchemaResultEntities()).results) {
    console.info(`Deleting form schema result ${formSchemaResult.Id}...`);
    await deleteFormSchemaResultEntity(formSchemaResult.Id);
  }

  for (const customer of (await getAllCustomerEntities()).results) {
    console.info(`Deleting customer ${customer.Id}...`);
    await deleteCustomerEntity(customer.Id);
  }

  for (const formSchema of (await getAllFormSchemaEntities()).results) {
    console.info(`Deleting form schema ${formSchema.Id}...`);
    await deleteFormSchemaEntity(formSchema.Id);
  }

  console.info('Creating demo customer...');
  await createCustomerEntity({
    Name: 'Demo Customer',
    CustomerCode: 'DEMO-001',
    Notes: 'A fictive customer, used for demos.',
  });

  console.info('Creating demo form schema...');
  await createFormSchemaEntity({
    Name: 'Demo Form Schema',
    Description: 'A form schema showing the features of the form engine.',
    Type: 'csrd',
    IsDraft: true,
    MetadataJson: '{}',
    SchemaJson: JSON.stringify(demoFormSchema),
  });

  console.info('Creating CSRD form schema...');
  await createFormSchemaEntity({
    Name: 'CSRD',
    Description: 'The CSRD questionnaire.',
    Type: 'csrd',
    IsDraft: false,
    MetadataJson: '{}',
    SchemaJson: JSON.stringify(csrdFormSchema),
  });

  console.info('Creating updated CSRD form schema...');
  await createFormSchemaEntity({
    Name: 'CSRD With Feedback',
    Description: 'The CSRD questionnaire with a new customer feedback section.',
    Type: 'csrd',
    IsDraft: true,
    MetadataJson: '{}',
    SchemaJson: JSON.stringify(updatedCsrdFormSchema),
  });
}
