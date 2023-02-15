def nest_delete(model, pk):
    obj = model.objects.get(pk=pk)
    childs = list(model.objects.filter(parent_id=pk))
    obj.delete()
    if len(childs) > 0:
        for child in childs:
            nest_delete(model, child.id)
    return True


def nest_create(datas):
    data_dict = {data["id"]: data for data in datas}
    for data in datas:
        parent_id = data["parent_id"]
        if parent_id != 0:
            parent = data_dict[parent_id]
            if "childs" not in parent:
                parent["childs"] = []
            parent["childs"].append(data)

    root_data = filter(lambda data: data["parent_id"] == 0, datas)
    return root_data
