module.exports = {
    generatePaginationPath: (req) => {
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const baseUrl = req.baseUrl;

        // Construir links para paginação
        const nextPage = `${baseUrl}?offset=${offset + limit}&limit=${limit}`;
        const prevPage = offset > 0 ? `${baseUrl}?offset=${Math.max(0, offset - limit)}&limit=${limit}` : null;
        
        return { nextPage, prevPage };
    },

    paginate: async (model, options = {}) => {
        let query = {
            where: options.where || {},
            attributes: options.attributes || {},
            order: options.order || [],
            include: options.include || [],
            group: options.group || [],
            offset: options.offset ? parseInt(options.offset) : 0,
            limit: options.limit ? parseInt(options.limit) : 10,
        };

        if (query.group.length > 0) {
            const results = await model.findAll(query);
            const totalItems = results.length;
            const totalPages = Math.ceil(totalItems / query.limit);
            const currentPage = Math.floor(query.offset / query.limit) + 1;

            return {
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1
                },
                data: results
            };
        }

        const { count, rows } = await model.findAndCountAll(query);
        const totalItems = count;
        const totalPages = Math.ceil(totalItems / query.limit);
        const currentPage = Math.floor(query.offset / query.limit) + 1;

        return {
            pagination: {
                totalItems,
                totalPages,
                currentPage,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1
            },
            data: rows
        };
    }
};