import Lang from './lang.type';
function getGenericCrudMessagesES(entity: string) {
  return {
    UPDATED: `${entity} actualizado correctamente`,
    ALREADY_EXISTS: `${entity} ya existe`,
    CREATED: `${entity} creado correctamente`,
    NOT_FOUND: `${entity} no encontrado`,
    DELETED: `${entity} eliminado correctamente`,
  };
}

const ES: Lang = {
  USER: {
    ...getGenericCrudMessagesES('Usuario'),
  },
  POST: {
    ...getGenericCrudMessagesES('Publicación'),
  },
};

export default ES;
