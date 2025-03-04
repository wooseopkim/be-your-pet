DROP FUNCTION search_animals(TEXT);

CREATE
OR REPLACE FUNCTION search_animals(queries TEXT []) RETURNS SETOF ANIMALS AS $$
DECLARE
    stmt TEXT;
BEGIN
    IF (array_upper($1, 1) IS NULL) THEN
        RETURN;
    END IF;

    SELECT 'SELECT * FROM animals WHERE ' INTO stmt;

    FOR i IN 1..array_length($1, 1) LOOP
        CONTINUE WHEN trim($1[i]) = '';

        IF (i > 1) THEN 
            stmt := stmt || ' AND ';
        END IF;

        stmt := stmt || format('jsonb_path_exists(body, ''$.** ? (@.type() == "string" && @ like_regex "%s" flag "i")''::jsonpath)', $1[i]);
    END LOOP;
    RETURN QUERY EXECUTE stmt USING $1;
END $$ LANGUAGE plpgsql;
