from .mutation_type import mutation
from .create_patient import mutation, resolve_create_patient
from .create_pathway import mutation, resolve_create_pathway
from .create_decision_point import mutation, resolve_create_decision

type_list = [mutation]
