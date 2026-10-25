import { z } from 'zod';

export default schema => (req, res, next) => (req.valide = schema.parse(req), next())
