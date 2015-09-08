exports.definition = {
	config: {
		columns: {
			id: 'String',
			value: 'Boolean'
		},
		adapter: {
			type: 'properties',
			idAttribute: 'id',
			collection_name: 'setting'
		}
	}
};
