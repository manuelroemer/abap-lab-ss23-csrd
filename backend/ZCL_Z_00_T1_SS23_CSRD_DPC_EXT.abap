CLASS zcl_z_00_t1_ss23_csrd_dpc_ext DEFINITION
  PUBLIC
  INHERITING FROM zcl_z_00_t1_ss23_csrd_dpc
  CREATE PUBLIC .

  PUBLIC SECTION.
  PROTECTED SECTION.
    METHODS formschemaset_get_entityset REDEFINITION.
    METHODS formschemaset_get_entity REDEFINITION.
    METHODS formschemaset_create_entity REDEFINITION.
    METHODS formschemaset_update_entity REDEFINITION.
    METHODS formschemaset_delete_entity REDEFINITION.

    METHODS formschemaresult_get_entityset REDEFINITION.
    METHODS formschemaresult_get_entity REDEFINITION.
    METHODS formschemaresult_create_entity REDEFINITION.
    METHODS formschemaresult_update_entity REDEFINITION.
    METHODS formschemaresult_delete_entity REDEFINITION.

    METHODS customerset_get_entityset REDEFINITION.
    METHODS customerset_get_entity REDEFINITION.
    METHODS customerset_create_entity REDEFINITION.
    METHODS customerset_update_entity REDEFINITION.
    METHODS customerset_delete_entity REDEFINITION.


  PRIVATE SECTION.
    METHODS get_key
      IMPORTING
        !it_key_tab   TYPE /iwbep/t_mgw_name_value_pair
        key           TYPE string
      RETURNING
        VALUE(result) TYPE string.

    METHODS find_current_version
      IMPORTING
                type          TYPE z00t1_sstring
      RETURNING VALUE(result) TYPE int4.

    METHODS verify_form_schema_exists
      IMPORTING
        id TYPE sysuuid_c36
      RAISING
        /iwbep/cx_mgw_busi_exception.

     METHODS verify_customer_exists
      IMPORTING
        id TYPE sysuuid_c36
      RAISING
        /iwbep/cx_mgw_busi_exception.
ENDCLASS.



CLASS zcl_z_00_t1_ss23_csrd_dpc_ext IMPLEMENTATION.
  METHOD formschemaset_get_entityset.
    " --------------------------------------------------------------------------------------------------------------- "
    " Form Schema Endpoints notes.
    "
    " These are responsible for managing the z00t1_fschema entities (hereafter called "form schema entity").
    " A form schema entity's purpose is to transport an arbitrary JSON document, the `schemaJson` to the
    " frontend which then uses that JSON schema to render arbitrary UI forms (in our case, the CSRD questionnaire).
    "
    " Form schema entities have the following traits:
    " - They can be flagged as draft via the `isDraft` attribute.
    " - The `schemaJson` can only be changed if the entity is a draft.
    "   It becomes IMMUTABLE once the entity is undrafted.
    "   This ensures data consistency: If a user filled a form for a given JSON schema, the JSON schema must not
    "   change afterwards to avoid breaking changes of the entered user-data.
    " - It is only possible to change the `isDraft` flag from `true` to `false`, not vice versa.
    " - Form schema entities have a unique type which is versioned.
    "   Undrafted form schema entities can be updated by publishing a new, higher version of the same type.
    "   E.g., assuming that there are two form schema entities of type "csrd" with the respective versions 1 and 2,
    "   then the entity with version 2 will be used by the frontend for new questionnaires, since it is an update of
    "   the previous one.
    "   Draft form schemas have the implicit version -1. They are not to be considered by the frontend (except for
    "   schema development).
    " --------------------------------------------------------------------------------------------------------------- "

    DATA(filter) = io_tech_request_context->get_osql_where_clause(  ).

    " The GET FormSchemaSet endpoint has one specialty:
    " We don't return the `schemaJson` and `metadataJson` fields.
    " Reason: Performance/Response size. These fields can potentially become very big.
    " Returning them for all entities here makes the response too large.
    " We *do* return the rest of the entity's fields here though. This means that an API consumer can
    " query this endpoint to find those schemas that they are interested in and then use GET FormSchemaSet('THE_ID')
    " for getting the full data/the actual JSON schema of those entities that they are interested in.
    SELECT id, createdAt, updatedAt, type, version, isDraft, name, description
    FROM z00t1_fschema
    WHERE (filter)
    ORDER BY type, version DESCENDING
    INTO CORRESPONDING FIELDS OF TABLE @et_entityset.
  ENDMETHOD.

  METHOD formschemaset_get_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).

    SELECT *
    FROM z00t1_fschema
    WHERE id = @id OR type = @id
    ORDER BY version DESCENDING
    INTO TABLE @DATA(results) UP TO 1 ROWS.

    READ TABLE results INTO er_entity INDEX 1.
  ENDMETHOD.

  METHOD formschemaset_create_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    GET TIME STAMP FIELD DATA(now).

    er_entity-mandt = sy-mandt.
    er_entity-id = cl_system_uuid=>create_uuid_c36_static( ).
    er_entity-createdat = now.
    er_entity-updatedat = now.

    IF er_entity-isdraft = abap_true.
      " Draft schemas always have a version of -1.
      " Once undrafted, they are assigned a real version number.
      er_entity-version = -1.
    ELSE.
      " Otherwise the version is auto-calculated to overwrite the current highest version.
      " Also explicitly reassign `isDraft` because the gateway, for whatever reason, allows null here.
      er_entity-isdraft = abap_false.
      er_entity-version = find_current_version( type = er_entity-type ) + 1.
    ENDIF.

    INSERT z00t1_fschema FROM er_entity.
  ENDMETHOD.

  METHOD formschemaset_update_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).

    " It's only possible to update the JSON schema of draft form schema entities.
    " Others are immutable.
    UPDATE z00t1_fschema
    SET schemajson = @er_entity-schemajson
    WHERE id = @id AND
          isdraft = @abap_true.

    " It IS possible to update some other properties of every form schema, even if undrafted.
    UPDATE z00t1_fschema
    SET metadatajson = @er_entity-metadatajson,
        name = @er_entity-name,
        description = @er_entity-description
    WHERE id = @id.

    " It's only possible to undraft schemas.
    " Once they are undrafted, that state cannot be reverted.
    DATA(nextVersion) = find_current_version( type = er_entity-type ) + 1.

    UPDATE z00t1_fschema
    SET isdraft = @abap_false,
        version = @nextVersion
    WHERE id = @id AND
          isdraft = @abap_true AND
          @er_entity-isdraft = @abap_false.

    " Finally, update `updatedAt`. Yes, this could have been done in one of the above queries,
    " but muh separation of concerns :^).
    GET TIME STAMP FIELD DATA(now).

    UPDATE z00t1_fschema
    SET updatedat = @now
    WHERE id = @id.
  ENDMETHOD.

  METHOD formschemaset_delete_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab  key = 'Id' ).
    DELETE FROM z00t1_fschema WHERE id = @id.
    DELETE FROM z00t1_fschemares WHERE formschemaid = @id.
  ENDMETHOD.

  METHOD find_current_version.
    SELECT MAX( version )
    FROM z00t1_fschema
    WHERE type = @type
    INTO @result.
  ENDMETHOD.

  METHOD verify_form_schema_exists.
    SELECT COUNT( * )
    FROM z00t1_fschema
    WHERE id = @id
    INTO @DATA(count).

    IF count = 0.
      RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
        EXPORTING
          message          = |The form schema with the ID { id } does not exist.|
          http_status_code = 404.
    ENDIF.
  ENDMETHOD.



  METHOD formschemaresult_get_entityset.
    " --------------------------------------------------------------------------------------------------------------- "
    " Form Schema Result Endpoints notes.
    "
    " These are responsible for managing the z00t1_fschemares entities (hereafter called "form schema result entity").
    " These result entities store the user-entered data to a corresponding form schema entity.
    " The user-entered data is stored as an arbitrary JSON string in the `schemaJson` attribute.
    "
    " Form schema result entities are associated with one form schema entity. This form schema entity is the entity
    " that was used to render the form in the frontend.
    "
    " It should, typically, only be possible to fill a form schema result for an *undrafted* form schema entity.
    " --------------------------------------------------------------------------------------------------------------- "

    DATA(filter) = io_tech_request_context->get_osql_where_clause(  ).

    " Similarly to the form schema entities, we don't return the JSON content here.
    " See the GET FormSchemaSet endpoint above, for details.
    SELECT id, createdAt, updatedAt, formSchemaId, customerid, isdraft
    FROM z00t1_fschemares
    WHERE (filter)
    ORDER BY updatedAt DESCENDING
    INTO CORRESPONDING FIELDS OF TABLE @et_entityset.
  ENDMETHOD.

  METHOD formschemaresult_get_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).

    SELECT SINGLE *
    FROM z00t1_fschemares
    WHERE id = @id
    INTO @er_entity.
  ENDMETHOD.

  METHOD formschemaresult_create_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    verify_form_schema_exists( id = er_entity-formschemaid ).
    verify_customer_exists( id = er_entity-customerid ).

    GET TIME STAMP FIELD DATA(now).

    er_entity-mandt = sy-mandt.
    er_entity-id = cl_system_uuid=>create_uuid_c36_static( ).
    er_entity-createdat = now.
    er_entity-updatedat = now.

    INSERT z00t1_fschemares FROM er_entity.
  ENDMETHOD.

  METHOD formschemaresult_update_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    verify_form_Schema_exists( id = er_entity-formschemaid ).
    verify_customer_exists( id = er_entity-customerid ).

    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).
    GET TIME STAMP FIELD DATA(now).

    UPDATE z00t1_fschemares
    SET resultjson = @er_entity-resultjson,
        metadatajson = @er_entity-metadatajson,
        formschemaid = @er_entity-formschemaid,
        isdraft = @er_entity-isdraft,
        updatedat = @now
    WHERE id = @id.
  ENDMETHOD.

  METHOD formschemaresult_delete_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab  key = 'Id' ).
    DELETE FROM z00t1_fschemares WHERE id = @id.
  ENDMETHOD.



  METHOD customerset_get_entityset.
    DATA(filter) = io_tech_request_context->get_osql_where_clause(  ).
    SELECT *
    FROM z00t1_customer
    WHERE (filter)
    ORDER BY name ASCENDING
    INTO CORRESPONDING FIELDS OF TABLE @et_entityset.
  ENDMETHOD.

  METHOD customerset_get_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).

    SELECT SINGLE *
    FROM z00t1_customer
    WHERE id = @id
    INTO @er_entity.
  ENDMETHOD.

  METHOD customerset_create_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    GET TIME STAMP FIELD DATA(now).

    er_entity-mandt = sy-mandt.
    er_entity-id = cl_system_uuid=>create_uuid_c36_static( ).
    er_entity-createdat = now.
    er_entity-updatedat = now.

    INSERT z00t1_customer FROM er_entity.
  ENDMETHOD.

  METHOD customerset_update_entity.
    io_data_provider->read_entry_data( IMPORTING es_data = er_entity ).
    DATA(id) = get_key( it_key_tab = it_key_tab key = 'Id' ).
    GET TIME STAMP FIELD DATA(now).

    UPDATE z00t1_customer
    SET name = @er_entity-name,
        customercode = @er_entity-customercode,
        notes = @er_entity-notes,
        updatedat = @now
    WHERE id = @id.
  ENDMETHOD.

  METHOD customerset_delete_entity.
    DATA(id) = get_key( it_key_tab = it_key_tab  key = 'Id' ).
    DELETE FROM z00t1_customer WHERE id = @id.
    DELETE FROM z00t1_fschemares WHERE customerid = @id.
  ENDMETHOD.

  METHOD verify_customer_exists.
    SELECT COUNT( * )
    FROM z00t1_customer
    WHERE id = @id
    INTO @DATA(count).

    IF count = 0.
      RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
        EXPORTING
          message          = |The customer with the ID { id } does not exist.|
          http_status_code = 404.
    ENDIF.
  ENDMETHOD.



  METHOD get_key.
    DATA kvp TYPE /iwbep/s_mgw_name_value_pair.
    READ TABLE it_key_tab INTO kvp WITH KEY name = key.
    result = kvp-value.
  ENDMETHOD.
ENDCLASS.
